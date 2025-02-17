import React from 'react';
import { FaHome, FaComments, FaUsers, FaBell, FaSearch, FaMoon } from 'react-icons/fa';
import './HomePage.css';

const HomePage = () => {
  const handleLogout = () => {
    // Clear authentication tokens or session data
    localStorage.removeItem('authToken'); // from localStorage
    window.location.href = '/login';
  
    console.log("Logged out successfully.");
  };
  

  return (
    <div className="homepage-container">
      {/* Top Bar */}
      <div className="top-bar">
        <h1 className="brand-name">EchoSpace</h1>
        <div className="top-bar-right">
          <button className="icon-btn">
            <FaBell />
          </button>
          <button className="icon-btn">
            <FaSearch />
          </button>
          <img src="path/to/profile.jpg" alt="Profile" className="profile-pic" />
          <button className="icon-btn dark-mode-btn">
            <FaMoon />
          </button>
        </div>
      </div>

      {/* Left Menu */}
      <div className="left-menu">
        <button className="menu-item">
          <FaHome className="icon" /> Home
        </button>
        <button className="menu-item">
          <FaComments className="icon" /> Discussions
        </button>
        <button className="menu-item">
          <FaUsers className="icon" /> Communities
        </button>
        <button className="menu-item">
          <FaComments className="icon" /> AI
        </button>
        <button className="menu-item">
          <FaUsers className="icon" /> Messages
        </button>
        <div className="friends-section">
          <h3>Friends</h3>
          <div className="friend">Friend 1</div>
          <div className="friend">Friend 2</div>
          {/* Add more friends */}
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="post-box">
          <img src="path/to/profile.jpg" alt="Profile" className="profile-pic-post" />
          <input type="text" placeholder="Say something..." className="post-input" />
        </div>
        <div className="feed">
          <div className="post">Post 1 - Media/Text</div>
          <div className="post">Post 2 - Media/Text</div>
          {/* Add more posts */}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="right-sidebar">
        <div className="activity-section">
          <h3>Activity</h3>
          <div className="activity">Activity 1</div>
          <div className="activity">Activity 2</div>
          {/* Add more activities */}
        </div>
        <div className="trending-section">
          <h3>Trending</h3>
          <div className="trending">Trending Topic 1</div>
          <div className="trending">Trending Topic 2</div>
          {/* Add more trending topics */}
        </div>
        {/* Logout Button */}
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default HomePage;
