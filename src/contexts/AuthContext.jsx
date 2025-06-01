import React, { useContext, useState, useEffect, createContext } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateEmail,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, storage, db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  function updateUserEmail(newEmail) {
    return updateEmail(auth.currentUser, newEmail);
  }

  function updateUserPassword(newPassword) {
    return updatePassword(auth.currentUser, newPassword);
  }

  async function uploadProfilePicture(file) {
    const fileRef = ref(storage, `profilePictures/${auth.currentUser.uid}`);
    await uploadBytes(fileRef, file);
    const photoURL = await getDownloadURL(fileRef);
    await updateProfile(auth.currentUser, { photoURL });
    setCurrentUser({ ...auth.currentUser, photoURL });
    return photoURL;
  }

  async function updateDisplayName(name) {
    await updateProfile(auth.currentUser, { displayName: name });
    setCurrentUser({ ...auth.currentUser, displayName: name });
  }

  async function updateFirestoreInfo({ displayName, phoneNumber, email }) {
    const userDocRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userDocRef, {
      displayName,
      phoneNumber,
      email,
    });
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    updateUserEmail,
    updateUserPassword,
    uploadProfilePicture,
    updateDisplayName,
    updateFirestoreInfo,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
