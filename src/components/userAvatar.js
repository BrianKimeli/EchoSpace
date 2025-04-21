import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import './userAvatar.css'; // You'll need to create this CSS file

const UserAvatar = ({ user, size = 'medium', showUsername = true, linkToProfile = true }) => {
  const { currentUser } = useContext(UserContext);
  
  // If no user is provided, use the current user
  const displayUser = user || currentUser || {
    username: 'anonymous',
    profilePicture: '/avatar.png'
  };
  
  // Determine the CSS class based on size
  const sizeClass = {
    small: 'avatar-sm',
    medium: 'avatar-md',
    large: 'avatar-lg'
  }[size] || 'avatar-md';
  
  const avatarContent = (
    <>
      <div className={`user-avatar ${sizeClass}`}>
        <img 
          src={displayUser.profilePicture || '/avatar.png'}
          alt={displayUser.username}
          className="avatar-image"
        />
      </div>
      {showUsername && (
        <span className="avatar-username">@{displayUser.username}</span>
      )}
    </>
  );
  
  if (linkToProfile) {
    return (
      <Link to={`/profile/${displayUser.username}`} className="user-avatar-container">
        {avatarContent}
      </Link>
    );
  }
  
  return (
    <div className="user-avatar-container">
      {avatarContent}
    </div>
  );
};

export default UserAvatar;