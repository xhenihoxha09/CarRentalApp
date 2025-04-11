import Navbar from "./components/Navbar";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import UpdateProfile from "./pages/UpdateProfile";
import ListCar from "./pages/Car/ListCar";
import RentCar from "./pages/Car/RentCar";
import AllCars from "./pages/Car/AllCars";
import MyCars from "./pages/Car/MyCars";
import Settings from "./pages/Settings";
import Booking from "./pages/Booking";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="/settings" element={<Settings />} />
            <Route
              path="/rent"
              element={
                <ProtectedRoute>
                  <RentCar />
                </ProtectedRoute>
              }
            />
            <Route path="/list-car" element={<ListCar />} />
            <Route
              path="/update-profile"
              element={
                <ProtectedRoute>
                  <UpdateProfile />
                </ProtectedRoute>
              }
            />
            <Route path="/book/:id" element={<Booking />} />

            <Route path="/cars" element={<AllCars />} />
            <Route path="/my-cars" element={<MyCars />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<h2>Page Not Found</h2>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
