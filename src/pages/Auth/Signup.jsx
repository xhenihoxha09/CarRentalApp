import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { updateProfile } from "firebase/auth";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // 1. Create Firebase Auth user
      const res = await signup(email, password);

      // 2. Update Firebase Auth profile
      await updateProfile(auth.currentUser, {
        displayName: `${firstName} ${lastName}`,
        photoURL: "",
      });

      await res.user.reload(); // 🔁 Refresh the Auth user
      const updatedUser = auth.currentUser; // 👤 Get fresh version
      console.log("✅ Updated user:", updatedUser.displayName);

      // 3. Save user to Firestore
      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        email: res.user.email,
        displayName: `${firstName} ${lastName}`,
        phoneNumber: phone,
        photoURL: "",
      });

      alert("Signed up successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Signup error:", err);
      setError("Failed to create an account: " + err.message);
    }
  };

  return (
    <div>
      <h2>Signup Page</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Phone Number:</label>
          <PhoneInput
            country="al"
            value={phone}
            onChange={setPhone}
            inputStyle={{ width: "100%" }}
            enableSearch
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}

export default Signup;
