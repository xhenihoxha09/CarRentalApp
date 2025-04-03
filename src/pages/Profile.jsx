import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch {
      setError("Failed to log out");
    }
  };

  const goToRentACar = () => {
    navigate("/rent");
  };

  const goToListYourCar = () => {
    navigate("/list-car");
  };

  const goToUpdateProfile = () => {
    navigate("/update-profile");
  };

  return (
    <div>
      <h2>User Profile</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>Email: {currentUser?.email}</p>
      <button onClick={goToRentACar}>Rent a Car</button>
      <button onClick={goToListYourCar}>List Your Car</button>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={goToUpdateProfile}>Update Profile</button>
    </div>
  );
}

export default Profile;
