import { useState, useEffect, useRef } from "react";
import { FiBell, FiMail, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  // Dropdown states
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef();
  const notificationsRef = useRef();

  // Bookings
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  const profilePic =
    currentUser?.photoURL ||
    "https://ui-avatars.com/api/?name=User&background=EEE&color=2E2E3A";

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(e.target)
      ) {
        setNotificationsOpen(false);
      }
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, []);

  // Fetch bookings where ownerId matches
  useEffect(() => {
    const fetchBookings = async () => {
      if (!currentUser) return;

      try {
        const bookingsQuery = query(
          collection(db, "bookings"),
          where("ownerId", "==", currentUser.uid)
        );
        const snapshot = await getDocs(bookingsQuery);
        const bookingsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBookings(bookingsData);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchBookings();
  }, [currentUser]);

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-[#FFFCFF] border-b border-[#CBD4C2]">
      {/* Logo */}
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

        {/* Notification Bell with Badge */}
        <div className="relative" ref={notificationsRef}>
          <button
            type="button"
            className="relative text-[#247BA0] hover:text-[#50514F] transition"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
          >
            <FiBell size={24} />
            {/* Red Badge */}
            {bookings.length > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full animate-ping">
                {bookings.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg ring-1 ring-black/5 z-50 transition transform origin-top-right scale-95 animate-fadeIn">
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Bookings
                </h3>
                {loadingBookings ? (
                  <p className="text-xs text-gray-500">Loading...</p>
                ) : bookings.length === 0 ? (
                  <p className="text-xs text-gray-500">No bookings yet.</p>
                ) : (
                  <ul className="space-y-2 max-h-48 overflow-y-auto">
                    {bookings.map((booking) => (
                      <li key={booking.id} className="text-sm text-gray-600">
                        {booking.renterEmail || "Someone"} booked{" "}
                        {booking.carName || "your car"}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>

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

          {/* Profile Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg ring-1 ring-black/5 z-50 transition transform origin-top-right scale-95 animate-fadeIn">
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
