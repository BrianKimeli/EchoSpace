import React, { useState, useEffect, useRef, useContext } from 'react';
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend } from 'chart.js';
import './profile.css';
import { UserContext } from '../contexts/UserContext';
import { Link } from 'react-router-dom'; // Import if you need navigation

// Register necessary Chart.js components
Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

const Profile = ({ username }) => {
  // Get currentUser from context
  const { currentUser, loading } = useContext(UserContext);
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Declare hooks (always at the top)
  const [activeTab, setActiveTab] = useState('activity');
  const [isFollowing, setIsFollowing] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Fetch profile data if viewing someone else's profile
  useEffect(() => {
    const fetchProfileData = async () => {
      // If no username is provided, it's the current user's profile
      if (!username && currentUser) {
        setProfileData(currentUser);
        setIsLoading(false);
        return;
      }
      
      // If username matches current user, use current user data
      if (username && currentUser && username === currentUser.username) {
        setProfileData(currentUser);
        setIsLoading(false);
        return;
      }
      
      // Otherwise fetch the other user's profile
      if (username) {
        try {
          const response = await fetch(`/api/users/${username}`);
          if (response.ok) {
            const data = await response.json();
            setProfileData(data);
          } else {
            console.error('Failed to fetch profile data');
            // Could set some error state here
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (!loading) {
      fetchProfileData();
    }
  }, [username, currentUser, loading]);

  // Determine which user data to display
  const displayUser = profileData || {
    username: "finesse",
    fullName: "Finesse Dev",
    profilePicture: "/avatar.png",
    bio: "Building EchoSpace 👨‍💻",
    location: "Nairobi",
    dateCreated: "2023-01-01",
    followers: 3210,
    following: 120,
    posts: [],
    tags: ["react", "ai", "social"],
    socialLinks: {
      twitter: "https://twitter.com/finesse",
      github: "https://github.com/finesse",
    },
    activityData: [
      { date: "2024-03-01", value: 10 },
      { date: "2024-03-02", value: 12 },
      { date: "2024-03-03", value: 8 },
    ],
  };

  // Prepare data for display
  const memberSince = displayUser.dateCreated
    ? new Date(displayUser.dateCreated).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  const formatNumber = (num) => {
    if (num === undefined || num === null || isNaN(num)) return "0";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Determine if this is the current user's profile
  const isOwnProfile = currentUser && displayUser.username === currentUser.username;

  // Create/update the chart when activeTab or activityData changes
  useEffect(() => {
    if (
      activeTab === 'activity' &&
      chartRef.current &&
      displayUser.activityData?.length > 0 &&
      typeof Chart !== 'undefined'
    ) {
      // Chart creation logic (your existing code)
      // ...
    }
    
    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, [activeTab, displayUser.activityData]);

  // Feedback timer effect
  useEffect(() => {
    if (showFeedback) {
      const timer = setTimeout(() => setShowFeedback(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showFeedback]);

  const handleFollowClick = () => {
    setIsFollowing(!isFollowing);
    if (!isFollowing) setShowFeedback(true);
  };

  // Show loading indicator if data is still loading
  if (isLoading) {
    return <div className="loading-indicator">Loading profile...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-cover"></div>
          <div className="profile-avatar-container">
            <img src={displayUser.profilePicture} alt={displayUser.username} className="profile-avatar" />
            <div className="profile-avatar-status online"></div>
          </div>
          {isOwnProfile && (
            <div className="edit-profile-button">
              <Link to="/profile/edit">Edit Profile</Link>
            </div>
          )}
        </div>

        <div className="profile-info">
          <h1 className="profile-username">{displayUser.username}</h1>
          {displayUser.fullName && <h2 className="profile-fullname">{displayUser.fullName}</h2>}
          <p className="profile-bio">{displayUser.bio || 'No bio available'}</p>

          <div className="profile-meta">
            {displayUser.location && (
              <span className="profile-location">
                <i className="location-icon" />{displayUser.location}
              </span>
            )}
            <span className="profile-date">Member since {memberSince}</span>
          </div>

          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-value">{formatNumber(displayUser.followers)}</span>
              <span className="stat-label">Followers</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{formatNumber(displayUser.following)}</span>
              <span className="stat-label">Following</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{formatNumber(displayUser.posts?.length || 0)}</span>
              <span className="stat-label">Posts</span>
            </div>
          </div>

          {displayUser.tags && displayUser.tags.length > 0 && (
            <div className="profile-tags">
              {displayUser.tags.map((tag, index) => (
                <span key={index} className="profile-tag">{tag}</span>
              ))}
            </div>
          )}

          {displayUser.socialLinks && Object.keys(displayUser.socialLinks).length > 0 && (
            <div className="profile-social-links">
              {Object.entries(displayUser.socialLinks).map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  className={`social-icon ${platform.toLowerCase()}`}
                  title={platform}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              ))}
            </div>
          )}

          {!isOwnProfile && (
            <>
              <button
                className={`profile-action-primary ${isFollowing ? 'following' : ''}`}
                onClick={handleFollowClick}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>

              <button
                className="profile-action-secondary"
                onClick={() => setShowMessageDialog(true)}
              >
                Message
              </button>
            </>
          )}
        </div>

        <div className="profile-extended">
          <div className="profile-tabs">
            <button
              className={`tab-button ${activeTab === 'activity' ? 'active' : ''}`}
              onClick={() => setActiveTab('activity')}
            >
              Activity
            </button>
            <button
              className={`tab-button ${activeTab === 'about' ? 'active' : ''}`}
              onClick={() => setActiveTab('about')}
            >
              About
            </button>
            <button
              className={`tab-button ${activeTab === 'gallery' ? 'active' : ''}`}
              onClick={() => setActiveTab('gallery')}
            >
              Gallery
            </button>
          </div>

          <div className="main-content">
          <div className={`tab-content ${activeTab === 'activity' ? 'active' : ''}`}>
            <h3>Recent Activity</h3>
            <div className='chart-container'>
            <canvas ref={chartRef} height="150" />
            </div>
            <div className="activity-feed"></div>
          </div>

          <div className={`tab-content ${activeTab === 'about' ? 'active' : ''}`}>
            <h3>About {currentUser.username}</h3>
            <div className="about-content">
              <p>This is where extended profile information would display.</p>
            </div>
          </div>

          <div className={`tab-content ${activeTab === 'gallery' ? 'active' : ''}`}>
            <h3>Gallery</h3>
            <div className="gallery-grid"></div>
          </div>
        </div>
      </div>

      {showFeedback && (
        <div className="follow-feedback show">
          You're now following {currentUser.username}!
        </div>
      )}

      {showMessageDialog && (
        <div className="message-dialog show">
          <div className="message-dialog-header">
            <h3>Message to {currentUser.username}</h3>
            <button className="dialog-close" onClick={() => setShowMessageDialog(false)}>
              &times;
            </button>
          </div>
          <div className="message-dialog-body">
            <textarea placeholder="Write your message..."></textarea>
            <button
              className="send-message-btn"
              onClick={() => setShowMessageDialog(false)}
            >
              Send
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default Profile;
