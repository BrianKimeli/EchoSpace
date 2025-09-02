import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './settings.css';

const Settings = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [userData, setUserData] = useState({
    username: 'echo_user',
    displayName: 'Echo Explorer',
    bio: 'Exploring the soundscape of social connections 🎶',
    email: 'user@echo.space',
    twoFactor: true,
    theme: 'dark',
    notificationPref: 'all',
  });

  const sections = [
    { id: 'profile', icon: 'user', label: 'Profile' },
    { id: 'security', icon: 'shield', label: 'Security' },
    { id: 'privacy', icon: 'lock', label: 'Privacy' },
    { id: 'notifications', icon: 'bell', label: 'Notifications' },
    { id: 'appearance', icon: 'palette', label: 'Appearance' },
    { id: 'advanced', icon: 'cog', label: 'Advanced' },
  ];

  const handleInputChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  };

  const handleToggle = (field) => {
    setUserData({
      ...userData,
      [field]: !userData[field]
    });
  };

  const handleSaveChanges = () => {
    // Mock save functionality
    alert('Settings saved successfully!');
  };

  return (
    <div className="settings-container">
      <div className="settings-sidebar">
        <Link to="/" className="back-link">← Back to Home</Link>
        <h2 className="settings-title">EchoSpace Settings</h2>
        <nav>
          {sections.map((section) => (
            <button
              key={section.id}
              className={`sidebar-item ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => setActiveSection(section.id)}
            >
              <span className="section-icon">
                {section.icon === 'user' && '👤'}
                {section.icon === 'shield' && '🛡️'}
                {section.icon === 'lock' && '🔒'}
                {section.icon === 'bell' && '🔔'}
                {section.icon === 'palette' && '🎨'}
                {section.icon === 'cog' && '⚙️'}
              </span>
              {section.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="settings-content">
        {activeSection === 'profile' && (
          <div className="settings-section">
            <h3>Profile Settings</h3>
            <div className="avatar-upload">
              <div className="avatar-preview">
                <img 
                  src="https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=80" 
                  alt="Profile" 
                  className="current-avatar"
                />
              </div>
              <button className="echo-btn">Change Avatar</button>
            </div>
            <div className="form-group">
              <label>Display Name</label>
              <input
                type="text"
                name="displayName"
                value={userData.displayName}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Bio</label>
              <textarea
                name="bio"
                value={userData.bio}
                onChange={handleInputChange}
                maxLength="150"
                rows="4"
              />
              <div className="character-count">
                {userData.bio.length}/150 characters
              </div>
            </div>
          </div>
        )}

        {activeSection === 'security' && (
          <div className="settings-section">
            <h3>Security Settings</h3>
            <div className="security-item">
              <div>
                <h4>Two-Factor Authentication</h4>
                <p>Add an extra layer of security to your account</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={userData.twoFactor}
                  onChange={() => handleToggle('twoFactor')}
                />
                <span className="slider"></span>
              </label>
            </div>
            <div className="form-group">
              <label>Change Password</label>
              <input type="password" placeholder="New Password" />
              <input type="password" placeholder="Confirm New Password" />
            </div>
          </div>
        )}

        {activeSection === 'notifications' && (
          <div className="settings-section">
            <h3>Notification Settings</h3>
            <div className="security-item">
              <div>
                <h4>Email Notifications</h4>
                <p>Receive notifications via email</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={userData.emailNotifications}
                  onChange={() => handleToggle('emailNotifications')}
                />
                <span className="slider"></span>
              </label>
            </div>
            <div className="security-item">
              <div>
                <h4>Push Notifications</h4>
                <p>Receive push notifications in your browser</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={userData.pushNotifications}
                  onChange={() => handleToggle('pushNotifications')}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        )}

        {activeSection === 'appearance' && (
          <div className="settings-section">
            <h3>Appearance Settings</h3>
            <div className="form-group">
              <label>Theme</label>
              <select
                name="theme"
                value={userData.theme}
                onChange={handleInputChange}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>
            </div>
          </div>
        )}

        <div className="settings-footer">
          <button className="echo-btn primary" onClick={handleSaveChanges}>Save Changes</button>
          <button className="echo-btn ghost">Discard Changes</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;