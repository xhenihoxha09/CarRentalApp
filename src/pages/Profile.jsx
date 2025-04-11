import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { currentUser, logout, uploadProfilePicture } = useAuth();
  const [error, setError] = useState("");
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser?.photoURL) {
      setProfilePicUrl(currentUser.photoURL);
    }
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch {
      setError("Failed to log out");
    }
  };

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setError("");
      const url = await uploadProfilePicture(file);
      setProfilePicUrl(url);
      alert("Profile picture updated!");
    } catch (err) {
      setError("Failed to update profile picture: " + err.message);
    }
  };

  const goToRentACar = () => {
    navigate("/rent");
  };

  const goToListYourCar = () => {
    navigate("/list-car");
  };

  const goToMyCars = () => {
    navigate("/my-cars");
  };

  const goToUpdateProfile = () => {
    navigate("/update-profile");
  };

  return (
    <div>
      <h2>User Profile</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>Email: {currentUser?.email}</p>
      {profilePicUrl && (
        <div>
          <img
            src={profilePicUrl}
            alt="Profile"
            style={{ width: "100px", height: "100px", borderRadius: "50%" }}
          />
        </div>
      )}
      <div>
        <input type="file" onChange={handleProfilePicUpload} />
      </div>
      <button onClick={goToRentACar}>Rent a Car</button>
      <button onClick={goToListYourCar}>List Your Car</button>
      <button onClick={goToMyCars}>My Listed Cars</button>
      <button onClick={goToUpdateProfile}>Update Profile</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Profile;
