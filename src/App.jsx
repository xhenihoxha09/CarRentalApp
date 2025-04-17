import Navbar from "./components/Navbar";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import UpdateProfile from "./pages/UpdateProfile";
import ListCar from "./pages/Car/ListCar";
import RentCar from "./pages/Car/RentCar";
import AllCars from "./pages/Car/AllCars";
import MyCars from "./pages/Car/MyCars";
import Settings from "./pages/Settings";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import CarDetails from "./pages/Car/CarDetails";
import Messages from "./pages/Messages";
import Conversation from "./pages/Conversation";

function AppContent() {
  const { currentUser } = useAuth();

  return (
    <>
      {currentUser && <Navbar />}
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <Landing />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />

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
        <Route
          path="/messages/:userId"
          element={
            <ProtectedRoute>
              <Conversation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rent"
          element={
            <ProtectedRoute>
              <RentCar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/list-car"
          element={
            <ProtectedRoute>
              <ListCar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/update-profile"
          element={
            <ProtectedRoute>
              <UpdateProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book/:id"
          element={
            <ProtectedRoute>
              <Booking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cars"
          element={
            <ProtectedRoute>
              <AllCars />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-cars"
          element={
            <ProtectedRoute>
              <MyCars />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cars/:id"
          element={
            <ProtectedRoute>
              <CarDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<h2>Page Not Found</h2>} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
