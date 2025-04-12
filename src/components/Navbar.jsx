import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/cars?search=${searchQuery}`);
  };

  return (
    <nav style={styles.navbar}>
      <Link to="/" style={styles.logo}>
        CarRental
      </Link>

      <form onSubmit={handleSearch} style={styles.searchForm}>
        <input
          type="text"
          placeholder="Search cars..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
        />
      </form>

      <div style={styles.navLinks}>
        <Link to="/cars" style={styles.link}>
          Browse
        </Link>
        <Link to="/my-bookings" style={styles.link}>
          My Bookings
        </Link>
        <Link to="/my-cars" style={styles.link}>
          My Cars
        </Link>
        <Link to="/list-car" style={styles.link}>
          List Car
        </Link>

        {currentUser && (
          <div style={styles.profileContainer}>
            <img
              src={currentUser.photoURL || "https://via.placeholder.com/40"}
              alt="Profile"
              style={styles.profilePic}
              onClick={toggleDropdown}
            />
            {dropdownOpen && (
              <div style={styles.dropdown}>
                <button
                  onClick={() => navigate("/profile")}
                  style={styles.dropdownItem}
                >
                  Profile
                </button>
                <button
                  onClick={() => navigate("/settings")}
                  style={styles.dropdownItem}
                >
                  Settings
                </button>
                <button onClick={handleLogout} style={styles.dropdownItem}>
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f5f5f5",
    padding: "10px 20px",
    borderBottom: "1px solid #ddd",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  logo: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    textDecoration: "none",
    color: "#333",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  link: {
    textDecoration: "none",
    color: "#333",
  },
  searchForm: {
    flex: 1,
    maxWidth: "400px",
    margin: "0 20px",
  },
  searchInput: {
    width: "100%",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  profileContainer: {
    position: "relative",
  },
  profilePic: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    cursor: "pointer",
  },
  dropdown: {
    position: "absolute",
    right: 0,
    top: "50px",
    backgroundColor: "white",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    borderRadius: "6px",
    overflow: "hidden",
    zIndex: 1000,
  },
  dropdownItem: {
    padding: "10px 15px",
    background: "none",
    border: "none",
    width: "100%",
    textAlign: "left",
    cursor: "pointer",
  },
};

export default Navbar;
