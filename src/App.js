import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Auth from './components/auth';
import HomePage from './components/HomePage';
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    // Simulate login and set authenticated state
    setIsAuthenticated(true);
    console.log('User logged in');
  };

  const handleLogout = () => {
    // Simulate logout and reset authentication state
    setIsAuthenticated(false);
    console.log('User logged out');
  };

  return (
    <Router>
      <Routes>
        {/* If user is authenticated, navigate to homepage, otherwise show Auth */}
        <Route path="/login" element={isAuthenticated ? <Navigate to="/home" /> : <Auth onLogin={handleLogin} />} />

        {/* Route for the Homepage, add logout functionality */}
        <Route path="/home" element={isAuthenticated ? <HomePage onLogout={handleLogout} /> : <Navigate to="/login" />} />

        {/* Default route (redirect to login or homepage based on authentication) */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
