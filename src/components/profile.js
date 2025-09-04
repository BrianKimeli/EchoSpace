import React, { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import './profile.css';

const Profile = () => {
  const { currentUser } = useContext(UserContext);

  return (
    <div className="profile">
      <div className="profile-content">
        <h1>Profile</h1>
        {currentUser ? (
          <div className="profile-info">
            <h2>{currentUser.username || 'User'}</h2>
            <p>{currentUser.bio || 'No bio available'}</p>
            {currentUser.location && <p>📍 {currentUser.location}</p>}
          </div>
        ) : (
          <p>Please log in to view your profile.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;