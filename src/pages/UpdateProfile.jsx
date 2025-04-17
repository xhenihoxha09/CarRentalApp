import React, { useRef, useState } from "react";
import { auth, db, storage } from "../firebase";
import { updateProfile, updateEmail, updatePassword } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";

function UpdateProfile() {
  const nameRef = useRef();
  const phoneRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const [profilePicFile, setProfilePicFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      let photoURL = auth.currentUser.photoURL || "";

      // Upload profile picture if a new one is selected
      if (profilePicFile) {
        const fileRef = ref(storage, `profilePictures/${auth.currentUser.uid}`);
        await uploadBytes(fileRef, profilePicFile);
        photoURL = await getDownloadURL(fileRef);
      }

      // Update email if changed
      if (emailRef.current.value !== auth.currentUser.email) {
        await updateEmail(auth.currentUser, emailRef.current.value);
      }

      // Update password if filled
      if (passwordRef.current.value) {
        await updatePassword(auth.currentUser, passwordRef.current.value);
      }

      // Update display name & photo in Firebase Auth
      await updateProfile(auth.currentUser, {
        displayName: nameRef.current.value,
        photoURL,
      });

      // Update Firestore user record
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        displayName: nameRef.current.value,
        phoneNumber: phoneRef.current.value,
        photoURL,
        email: emailRef.current.value,
      });

      setMessage("Profile updated successfully!");
    } catch (error) {
      console.error("Update error:", error.message);
      setMessage("Failed to update profile: " + error.message);
    }

    setLoading(false);
  };

  return (
    <div>
      <h2>Update Profile</h2>
      {message && (
        <p style={{ color: message.includes("Failed") ? "red" : "green" }}>
          {message}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Full Name:</label>
          <input
            type="text"
            ref={nameRef}
            defaultValue={auth.currentUser.displayName || ""}
          />
        </div>
        <div>
          <label>Phone:</label>
          <input type="text" ref={phoneRef} />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            ref={emailRef}
            defaultValue={auth.currentUser.email}
          />
        </div>
        <div>
          <label>New Password:</label>
          <input type="password" ref={passwordRef} />
        </div>
        <div>
          <label>Profile Picture:</label>
          <input
            type="file"
            onChange={(e) => setProfilePicFile(e.target.files[0])}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
}

export default UpdateProfile;
