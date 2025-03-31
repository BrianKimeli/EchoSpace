import React, { useState } from 'react';
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

  return (
    <div className="settings-container">
      <div className="settings-sidebar">
        <h2 className="settings-title">EchoSpace Settings</h2>
        <nav>
          {sections.map((section) => (
            <button
              key={section.id}
              className={`sidebar-item ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => setActiveSection(section.id)}
            >
              <i className={`fas fa-${section.icon}`}></i>
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
              <div className="avatar-preview"></div>
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
              />
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

        {/* Add other sections similarly */}

        <div className="settings-footer">
          <button className="echo-btn primary">Save Changes</button>
          <button className="echo-btn ghost">Discard Changes</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;