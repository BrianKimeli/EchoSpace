import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Auth from './components/auth';
import HomePage from './components/HomePage';  // Assume HomePage is already created

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={!isAuthenticated ? <Auth onLogin={handleLogin} /> : <Navigate to="/home" />} />
        <Route path="/home" element={isAuthenticated ? <HomePage /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;