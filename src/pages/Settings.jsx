import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { updateEmail, updatePassword, updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

function Settings() {
  const { currentUser, uploadProfilePicture } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [previewPic, setPreviewPic] = useState(currentUser?.photoURL || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPreviewPic(currentUser?.photoURL || "");
    setDisplayName(currentUser?.displayName || "");
    setPhoneNumber(currentUser?.phoneNumber || "");
    setEmail(currentUser?.email || "");
  }, [currentUser]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (email !== currentUser.email) {
        await updateEmail(currentUser, email);
      }

      if (newPassword) {
        await updatePassword(currentUser, newPassword);
      }

      if (displayName !== currentUser.displayName) {
        await updateProfile(currentUser, { displayName });
      }

      await updateDoc(doc(db, "users", currentUser.uid), {
        displayName,
        phoneNumber,
        email,
      });

      setSuccess("Profile updated successfully!");
      setNewPassword("");
      setCurrentPassword("");
    } catch (err) {
      setError("Failed to update profile: " + err.message);
    }

    setLoading(false);
  };

  const handlePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setError("");
      const url = await uploadProfilePicture(file);
      setPreviewPic(url);
      setSuccess("Profile picture updated!");
    } catch (err) {
      setError("Failed to upload picture: " + err.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Settings</h2>

      {error && (
        <p className="bg-red-100 text-red-600 px-4 py-2 rounded mb-4">
          {error}
        </p>
      )}
      {success && (
        <p className="bg-green-100 text-green-600 px-4 py-2 rounded mb-4">
          {success}
        </p>
      )}

      {/* Profile Picture */}
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-2">Update Profile Picture</h3>
        {previewPic && (
          <img
            src={previewPic}
            alt="Profile"
            className="w-24 h-24 rounded-full mb-4 object-cover"
          />
        )}
        <input
          type="file"
          onChange={handlePicUpload}
          className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0
                     file:text-sm file:font-semibold file:bg-[#2E2E3A] file:text-white hover:file:bg-[#1c1c26]"
        />
      </div>

      {/* Update Form */}
      <form onSubmit={handleProfileUpdate} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#2E2E3A] text-white px-4 py-2 rounded hover:bg-[#1c1c26] text-sm w-full"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
}

export default Settings;
