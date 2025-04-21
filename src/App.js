import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./components/HomePage";
import Auth from "./components/auth";
import Messages from "./components/messages";
import Settings from "./components/settings";
import Communities from "./components/communities";
import AIPage from "./components/ai";
import ProfileSetup from "./components/profilesetup";
import { UserProvider } from './contexts/UserContext';
import Profile from "./components/profile";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const handleSignupSuccess = () => {
    setShowProfileSetup(true);
  };

  // Called when profile setup is complete.
  const handleProfileComplete = (profileData) => {
    console.log("Profile setup complete with:", profileData);
    // Optionally send profileData to your backend for saving.
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <Auth setIsAuthenticated={setIsAuthenticated} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <HomePage handleLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/profile"
            element={
              isAuthenticated ? (
                <Profile />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/messages"
            element={
              isAuthenticated ? (
                <Messages setIsAuthenticated={setIsAuthenticated} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/settings"
            element={
              isAuthenticated ? (
                <Settings setIsAuthenticated={setIsAuthenticated} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/communities"
            element={
              isAuthenticated ? (
                <Communities setIsAuthenticated={setIsAuthenticated} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="*"
            element={<Navigate to="/" />}
          />
          <Route
            path="/profilesetup"
            element={
              // Pass the onComplete prop here:
              <ProfileSetup onComplete={handleProfileComplete} />
            }
          />
          <Route
            path="/ai"
            element={
              isAuthenticated ? (
                <AIPage setIsAuthenticated={setIsAuthenticated}/>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;