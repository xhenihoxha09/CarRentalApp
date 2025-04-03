import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function UpdateProfile() {
  const { currentUser, updateEmail, updatePassword } = useAuth();
  const [email, setEmail] = useState(currentUser?.email || "");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      if (email !== currentUser.email) {
        await updateEmail(email);
      }
      if (newPassword) {
        await updatePassword(newPassword, currentPassword);
      }
      setMessage("Profile updated successfully!");
    } catch (err) {
      setError("Failed to update profile: " + err.message);
    }
  };

  return (
    <div>
      <h2>Update Profile</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
      <form onSubmit={handleUpdate}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Current Password:</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div>
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <button type="submit">Update Profile</button>
      </form>
      <button onClick={() => navigate("/profile")}>Back to Profile</button>
    </div>
  );
}

export default UpdateProfile;
