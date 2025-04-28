// ✅ src/pages/Settings.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

function Settings() {
  const { currentUser, updatePassword, uploadProfilePicture } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [previewPic, setPreviewPic] = useState(currentUser?.photoURL || "");

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await updatePassword(newPassword, currentPassword);
      setSuccess("Password updated successfully!");
      setNewPassword("");
      setCurrentPassword("");
    } catch (err) {
      setError(err.message);
    }
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

  useEffect(() => {
    setPreviewPic(currentUser?.photoURL || "");
  }, [currentUser]);

  return (
    <div>
      <h2>Settings</h2>
      
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <div style={{ marginBottom: "30px" }}>
        <h3>Update Profile Picture</h3>
        {previewPic && (
          <img
            src={previewPic}
            alt="Preview"
            style={{ width: "100px", height: "100px", borderRadius: "50%" }}
          />
        )}
        <input type="file" onChange={handlePicUpload} />
      </div>

      <div>
        <h3>Change Password</h3>
        <form onSubmit={handlePasswordUpdate}>
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button type="submit">Update Password</button>
        </form>
      </div>
    </div>
  );
}

export default Settings;
