import React, { useState, useEffect } from 'react';
import { FaHome, FaComments, FaUsers, FaBell, FaSearch, FaMoon, FaPlus, FaUser, FaCog, 
  FaSignOutAlt, FaArrowUp, FaArrowDown, FaComment, FaImage, FaSmile, FaLink, FaShare,
  FaBookmark, FaEllipsisH, FaSun, FaTimes, FaBars, FaMicrophone } from 'react-icons/fa';
import './HomePage.css';

const HomePage = () => {
  // State management
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(2);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [postText, setPostText] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLeftMenu, setShowLeftMenu] = useState(false);
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Jane Doe',
      profilePic: 'https://via.placeholder.com/50',
      text: 'Just discovered an amazing hiking trail today! The views were breathtaking and the weather was perfect.',
      image: 'https://via.placeholder.com/600x400',
      likes: 24,
      comments: 7,
      timePosted: '2 hours ago'
    },
    {
      id: 2,
      author: 'John Smith',
      profilePic: 'https://via.placeholder.com/50',
      text: 'Working on a new project with the team. Can\'t wait to share the results with everyone!',
      image: 'https://via.placeholder.com/600x400',
      likes: 42,
      comments: 11,
      timePosted: '4 hours ago'
    },
    {
      id: 3,
      author: 'Alex Johnson',
      profilePic: 'https://via.placeholder.com/50',
      text: 'Does anyone have recommendations for good productivity apps? Looking to organize my workflow better.',
      image: null,
      likes: 18,
      comments: 15,
      timePosted: '6 hours ago'
    }
  ]);
  
  // Track post interactions
  const [postInteractions, setPostInteractions] = useState({});
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-dropdown') && !event.target.closest('.dropdown-menu')) {
        setShowProfileDropdown(false);
      }
      if (!event.target.closest('.notification-container') && !event.target.closest('.notifications-dropdown')) {
        setShowNotifications(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Check if dark mode is saved in localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.body.classList.add('dark-mode');
    }
  }, []);

  const handleNewPost = () => {
    if (postText.trim() || imagePreview) {
      const newPost = {
        id: Date.now(),
        author: 'You',
        profilePic: 'https://via.placeholder.com/50',
        text: postText,
        image: imagePreview,
        likes: 0,
        comments: 0,
        timePosted: 'Just now'
      };
      setPosts([newPost, ...posts]);
      setPostText('');
      setImagePreview(null);
    } else {
      alert('Please add some text or an image to post!');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  };

  const toggleDarkMode = () => {
    const newDarkModeState = !isDarkMode;
    setIsDarkMode(newDarkModeState);
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', newDarkModeState);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddLink = () => {
    const url = prompt('Enter the URL:');
    if (url) {
      setPostText((prevText) => prevText + ` [Link](${url})`);
    }
  };
  
  const handlePostInteraction = (postId, type) => {
    const currentInteractions = postInteractions[postId] || {};
    
    if (type === 'like') {
      const currentLikeState = currentInteractions.liked || false;
      // Update posts
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likes: currentLikeState ? post.likes - 1 : post.likes + 1
          };
        }
        return post;
      }));
      
      // Update interaction state
      setPostInteractions({
        ...postInteractions,
        [postId]: {
          ...currentInteractions,
          liked: !currentLikeState,
          // Remove dislike if liking
          disliked: currentLikeState ? currentInteractions.disliked : false
        }
      });
    } else if (type === 'dislike') {
      const currentDislikeState = currentInteractions.disliked || false;
      
      // Update interaction state
      setPostInteractions({
        ...postInteractions,
        [postId]: {
          ...currentInteractions,
          disliked: !currentDislikeState,
          // Remove like if disliking
          liked: currentDislikeState ? currentInteractions.liked : false
        }
      });
    }
  };
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // Here you would typically call an API to search
      // For now, just close the search bar
      setShowSearchBar(false);
    }
  };
  
  const markAllNotificationsAsRead = () => {
    setUnreadNotifications(0);
  };
  
  const removeImagePreview = () => {
    setImagePreview(null);
  };

  return (
    <div className={`homepage-container ${isDarkMode ? 'dark-mode' : ''}`}>
      {/* Top Bar */}
      <div className="top-bar">
        <button className="menu-toggle-btn" onClick={() => setShowLeftMenu(!showLeftMenu)}>
        <FaBars />
        </button>
        <h1 className="brand-name">EchoSpace</h1>
        <div className="top-bar-right">
          <button className="icon-btn" onClick={() => setShowSearchBar(!showSearchBar)} title="Search">
            <FaSearch />
          </button>
          {showSearchBar && (
            <form onSubmit={handleSearchSubmit} className="search-form">
              <input
                type="text"
                placeholder="Search EchoSpace"
                className="search-bar"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button type="submit" className="search-submit">
                <FaSearch />
              </button>
            </form>
          )}
          <div className="notification-container">
            <button className="icon-btn" onClick={() => setShowNotifications(!showNotifications)} title="Notifications">
              <FaBell />
              {unreadNotifications > 0 && <span className="notification-badge">{unreadNotifications}</span>}
            </button>
            {showNotifications && (
              <div className="notifications-dropdown">
                <div className="notifications-header">
                  <h3>Notifications</h3>
                  {unreadNotifications > 0 && (
                    <button className="mark-read-btn" onClick={markAllNotificationsAsRead}>
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="notification unread">
                  <img src="https://via.placeholder.com/30" alt="User1" className="notification-profile-pic" />
                  <div className="notification-content">
                    <strong>User1</strong> liked your post
                    <span className="notification-time">5 min ago</span>
                  </div>
                </div>
                <div className="notification unread">
                  <img src="https://via.placeholder.com/30" alt="User2" className="notification-profile-pic" />
                  <div className="notification-content">
                    <strong>User2</strong> commented on your discussion
                    <span className="notification-time">20 min ago</span>
                  </div>
                </div>
                <div className="notification">
                  <img src="https://via.placeholder.com/30" alt="User3" className="notification-profile-pic" />
                  <div className="notification-content">
                    <strong>User3</strong> sent you a friend request
                    <span className="notification-time">1 hour ago</span>
                  </div>
                </div>
                <div className="notification">
                  <img src="https://via.placeholder.com/30" alt="User4" className="notification-profile-pic" />
                  <div className="notification-content">
                    <strong>User4</strong> mentioned you in a comment
                    <span className="notification-time">2 hours ago</span>
                  </div>
                </div>
                <div className="view-all-notifications">
                  <a href="/notifications">View All</a>
                </div>
              </div>
            )}
          </div>
          <button className="icon-btn dark-mode-btn" onClick={toggleDarkMode} title={isDarkMode ? "Light Mode" : "Dark Mode"}>
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>
          <div className="profile-dropdown">
            <img 
              src="https://via.placeholder.com/40" 
              alt="Profile" 
              className="profile-pic" 
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            />
            {showProfileDropdown && (
              <div className="dropdown-menu">
                <div className="dropdown-item"><FaUser /> Profile</div>
                <div className="dropdown-item"><FaCog /> Settings</div>
                <div className="dropdown-item" onClick={handleLogout}><FaSignOutAlt /> Logout</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Left Menu */}
      <div className={`left-menu ${showLeftMenu ? 'show' : ''}`}>
        <button className="menu-item active"><FaHome className="icon" /> Home</button>
        <button className="menu-item"><FaComments className="icon" /> Discussions</button>
        <button className="menu-item"><FaUsers className="icon" /> Communities</button>
        <button className="menu-item"><FaComments className="icon" /> AI</button>
        <button className="menu-item"><FaUsers className="icon" /> Messages</button>
        <div className="friends-section">
          <h3>Friends</h3>
          <div className="friend online">
            <img src="https://via.placeholder.com/30" alt="Friend 1" className="friend-pic" />
            <span className="friend-name">Friend 1</span>
            <span className="online-indicator"></span>
          </div>
          <div className="friend">
            <img src="https://via.placeholder.com/30" alt="Friend 2" className="friend-pic" />
            <span className="friend-name">Friend 2</span>
          </div>
          <div className="friend online">
            <img src="https://via.placeholder.com/30" alt="Friend 3" className="friend-pic" />
            <span className="friend-name">Friend 3</span>
            <span className="online-indicator"></span>
          </div>
        </div>
        <div className="friend-requests">
          <h3>Friend Requests</h3>
          <div className="request">
            <img src="https://via.placeholder.com/30" alt="User3" className="friend-pic" />
            <span className="request-name">User3</span>
            <div className="request-buttons">
              <button className="accept-btn">Accept</button>
              <button className="decline-btn">Decline</button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="post-box">
          <div className="post-box-header">
            <img src="https://via.placeholder.com/50" alt="Profile" className="profile-pic-post" />
            <textarea
              placeholder="You wanna say something?"
              className="post-input"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
            />
            <button className="voice-btn">
              <FaMicrophone />
            </button>
          </div>
          
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" className="preview-image" />
              <button className="remove-image-btn" onClick={removeImagePreview}>
                <FaTimes />
              </button>
            </div>
          )}
          
          <div className="post-options">
            <button className="option-btn" onClick={() => document.getElementById('image-upload').click()}>
              <FaImage /> Add Image
            </button>
            <button className="option-btn" onClick={handleAddLink}>
              <FaLink /> Add Link
            </button>
            <button className="option-btn">
              <FaSmile /> Add Emoji
            </button>
            <button class="option-btn">
              <span class="voice-icon">🎤</span> Voice
            </button>
          </div>
          <button className="new-post-btn" onClick={handleNewPost}>
            <FaPlus /> New Post
          </button>
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageUpload}
          />
        </div>

        {/* Feed */}
        <div className="feed">
          {posts.map((post) => (
            <div className="post" key={post.id}>
              <div className="post-header">
                <div className="post-author">
                  <img src={post.profilePic} alt={post.author} className="post-author-pic" />
                  <div className="post-author-info">
                    <div className="post-author-name">{post.author}</div>
                    <div className="post-time">{post.timePosted}</div>
                  </div>
                </div>
                <button className="post-options-btn">
                  <FaEllipsisH />
                </button>
              </div>
              <div className="post-text">{post.text}</div>
              {post.image && (
                <img src={post.image} alt="Post" className="post-media" />
              )}
              <div className="post-content">
                <div className="post-stats">
                  <span>{post.likes} likes</span>
                  <span>{post.comments} comments</span>
                </div>
                <div className="post-interactions">
                  <button 
                    className={`upvote-btn ${postInteractions[post.id]?.liked ? 'active' : ''}`}
                    onClick={() => handlePostInteraction(post.id, 'like')}
                  >
                    <FaArrowUp /> Like
                  </button>
                  <button 
                    className={`downvote-btn ${postInteractions[post.id]?.disliked ? 'active' : ''}`}
                    onClick={() => handlePostInteraction(post.id, 'dislike')}
                  >
                    <FaArrowDown /> Dislike
                  </button>
                  <button className="comment-btn">
                    <FaComment /> Comment
                  </button>
                  <button className="share-btn">
                    <FaShare /> Share
                  </button>
                  <button className="bookmark-btn">
                    <FaBookmark /> Save
                  </button>
                </div>
                
                {/* Comment section */}
                <div className="comments-preview">
                  <div className="comment-input-container">
                    <img src="https://via.placeholder.com/40" alt="Your profile" className="comment-profile-pic" />
                    <input type="text" className="comment-input" placeholder="Write a comment..." />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="right-sidebar">
        <div className="trending-section">
          <h3>Trending Now</h3>
          <div className="trending">
            <span className="trending-tag">#TechNews</span>
            <span className="trending-count">2.4K posts</span>
          </div>
          <div className="trending">
            <span className="trending-tag">#ArtificialIntelligence</span>
            <span className="trending-count">1.8K posts</span>
          </div>
          <div className="trending">
            <span className="trending-tag">#WebDevelopment</span>
            <span className="trending-count">3.6K posts</span>
          </div>
        </div>
        <div className="suggested-connections">
          <h3>Suggested Connections</h3>
          <div className="suggested-user">
            <img src="https://via.placeholder.com/40" alt="Suggested User" className="suggested-user-pic" />
            <div className="suggested-user-info">
              <div className="suggested-user-name">Jane Smith</div>
              <div className="mutual-connections">4 mutual connections</div>
            </div>
            <button className="connect-btn">Connect</button>
          </div>
          <div className="suggested-user">
            <img src="https://via.placeholder.com/40" alt="Suggested User" className="suggested-user-pic" />
            <div className="suggested-user-info">
              <div className="suggested-user-name">Mike Johnson</div>
              <div className="mutual-connections">2 mutual connections</div>
            </div>
            <button className="connect-btn">Connect</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;