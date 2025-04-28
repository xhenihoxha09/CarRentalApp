import { useState, useRef, useEffect } from "react";
import { FiBell, FiMail, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown if clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, []);

  // For profile pic fallback
  const profilePic =
    currentUser?.photoURL ||
    "https://ui-avatars.com/api/?name=User&background=EEE&color=2E2E3A";

  return (
    <nav className="flex items-center px-6 py-3 bg-[#FFFCFF] border-b border-[#CBD4C2]">
      {/* Logo & Branding */}
      <div
        className="flex items-center cursor-pointer"
        onClick={() => navigate("/cars")}
      >
        <span className="text-3xl font-shrikhand font-bold">
          <span className="text-[#A9FF3A] italic">C</span>
          <span className="text-[#2E2E3A] italic">RENT</span>
        </span>
      </div>

      {/* Search */}
      <div className="flex flex-1 mx-6">
        <div className="flex items-center w-full bg-[#FFFCFF] border border-[#CBD4C2] rounded-full px-4 py-2">
          <input
            className="flex-1 bg-transparent outline-none text-gray-700"
            placeholder="Search for cars, locations.."
          />
          <FiSearch className="text-[#247BA0] text-xl ml-2" />
        </div>
      </div>

      {/* Icons */}
      <div className="flex items-center space-x-6">
        {/* Inbox Icon */}
        <button
          className="text-[#247BA0] hover:text-[#50514F] transition"
          onClick={() => navigate("/messages")}
        >
          <FiMail size={24} />
        </button>
        {/* Notification Icon */}
        <button
          className="text-[#247BA0] hover:text-[#50514F] transition"
          onClick={() => navigate("/my-bookings")}
        >
          <FiBell size={24} />
        </button>
        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center focus:outline-none"
            onClick={() => setDropdownOpen((open) => !open)}
          >
            <img
              src={profilePic}
              alt="Profile"
              className="w-9 h-9 rounded-full border-2 border-[#247BA0] object-cover"
            />
            <svg
              className="w-4 h-4 ml-1 text-[#247BA0]"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  navigate("/profile");
                }}
                className="block w-full text-left px-4 py-2 hover:bg-[#CBD4C2]/30 text-[#2E2E3A]"
              >
                Profile
              </button>
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  navigate("/settings");
                }}
                className="block w-full text-left px-4 py-2 hover:bg-[#CBD4C2]/30 text-[#2E2E3A]"
              >
                Settings
              </button>
              <button
                onClick={async () => {
                  setDropdownOpen(false);
                  await logout();
                  navigate("/login");
                }}
                className="block w-full text-left px-4 py-2 hover:bg-[#A9FF3A]/30 text-[#247BA0] font-bold"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
