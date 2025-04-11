import React, { useContext, useState, useEffect } from "react";
import { auth, db, storage } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateEmail as firebaseUpdateEmail,
  updatePassword as firebaseUpdatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateProfile } from "firebase/auth";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

// 🔐 Save user info to Firestore (for future reference)
const saveUserData = async (user) => {
  try {
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
    });
    console.log("User data saved to Firestore!");
  } catch (error) {
    console.error("Error saving user data:", error.message);
  }
};

// 🔐 Re-authenticate user for sensitive actions
const reauthenticateUser = async (user, currentPassword) => {
  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);
};

// 🔁 Upload profile picture to Firebase Storage
const uploadProfilePicture = async (file) => {
  if (!auth.currentUser) throw new Error("User not logged in");

  const fileRef = ref(storage, `profilePictures/${auth.currentUser.uid}.jpg`);
  await uploadBytes(fileRef, file);
  const photoURL = await getDownloadURL(fileRef);

  // ✅ Update user's Firebase Auth profile with new photo URL
  await updateProfile(auth.currentUser, { photoURL });

  return photoURL;
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔄 Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false);
      if (user) {
        await saveUserData(user); // save email in Firestore
      }
    });

    return unsubscribe;
  }, []);

  // 🔑 Create account
  const signup = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await saveUserData(userCredential.user);
    return userCredential;
  };

  // 🔐 Login
  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    await saveUserData(userCredential.user);
    return userCredential;
  };

  // 🚪 Logout
  const logout = async () => {
    return await signOut(auth);
  };

  // ✏️ Update Email
  const updateEmail = async (newEmail) => {
    if (auth.currentUser) {
      await firebaseUpdateEmail(auth.currentUser, newEmail);
    }
  };

  // 🔑 Update Password (with reauth)
  const updatePassword = async (newPassword, currentPassword) => {
    if (auth.currentUser) {
      await reauthenticateUser(auth.currentUser, currentPassword);
      await firebaseUpdatePassword(auth.currentUser, newPassword);
    }
  };

  // Provide everything to the rest of the app
  const value = {
    currentUser,
    signup,
    login,
    logout,
    updateEmail,
    updatePassword,
    uploadProfilePicture,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
