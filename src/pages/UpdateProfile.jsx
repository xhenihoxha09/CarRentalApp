/*import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { updateEmail, updatePassword, updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function UpdateProfile() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.displayName || "");
      setPhoneNumber(currentUser.phoneNumber || "");
      setEmail(currentUser.email);
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      if (email !== currentUser.email) {
        await updateEmail(currentUser, email);
      }

      if (password) {
        await updatePassword(currentUser, password);
      }

      await updateProfile(currentUser, {
        displayName: displayName,
      });

      await updateDoc(doc(db, "users", currentUser.uid), {
        displayName,
        phoneNumber,
        email,
      });

      setMessage("Profile updated successfully!");
    } catch (err) {
      setError("Failed to update profile: " + err.message);
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#FFFCFF] p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <h2 className="text-2xl font-bold text-[#2E2E3A] mb-6">
          Update Profile
        </h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {message && <p className="text-green-500 mb-4">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#2E2E3A]">
              Full Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-2 border border-[#CBD4C2] rounded-lg focus:ring-2 focus:ring-[#A9FF3A] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2E2E3A]">
              Phone Number
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-2 border border-[#CBD4C2] rounded-lg focus:ring-2 focus:ring-[#A9FF3A] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2E2E3A]">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-[#CBD4C2] rounded-lg focus:ring-2 focus:ring-[#A9FF3A] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2E2E3A]">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-[#CBD4C2] rounded-lg focus:ring-2 focus:ring-[#A9FF3A] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2E2E3A]">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-[#CBD4C2] rounded-lg focus:ring-2 focus:ring-[#A9FF3A] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#A9FF3A] text-[#2E2E3A] font-bold py-2 mt-4 rounded-lg hover:bg-[#A9FF3A]/90 transition"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
*/