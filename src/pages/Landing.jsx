import React from "react";
import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", paddingTop: "100px" }}>
      <h1>Welcome to CarConnect 🚗</h1>
      <p>Please log in or sign up to get started.</p>
      <button onClick={() => navigate("/login")} style={{ margin: "10px" }}>
        Login
      </button>
      <button onClick={() => navigate("/signup")} style={{ margin: "10px" }}>
        Sign Up
      </button>
    </div>
  );
}

export default Landing;
