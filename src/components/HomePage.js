import React, { useState, useEffect } from 'react';
import { FaHome, FaImage, FaLink, FaComment, FaShare, FaArrowUp, FaArrowDown, FaUsers, FaComments, FaBell, FaMoon, FaSignOutAlt, FaSun, FaBars, FaSearch, FaUser, FaCog, FaPlus, FaRocket, FaChevronRight, FaPalette, FaLeaf, FaMicrophone, FaEllipsisH, FaChartLine, FaTimes, FaBookmark, FaQuestionCircle, FaMagic, FaVideo, FaSlidersH, FaHeadphones, FaPodcast } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = ({ handleLogout }) => { // Receive logout handler from props
  // Initialize all hooks at the top level of the component
  const navigate = useNavigate();
  const handleLogoutClick = () => {
    handleLogout(); // Call the passed logout handler
    navigate('/login'); // Redirect to login page
  };
  // State variables
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [postText, setPostText] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(2);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
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
      text: "Working on a new project with the team. Can't wait to share the results with everyone!",
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
  const [postInteractions, setPostInteractions] = useState({});

  // useEffect to check dark mode setting
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.body.classList.add('dark-mode');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkModeState = !isDarkMode;
    setIsDarkMode(newDarkModeState);
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', newDarkModeState);
  };

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

  const removeImagePreview = () => {
    setImagePreview(null);
  };

  const handleAddLink = () => {
    const url = prompt('Enter the URL:');
    if (url) {
      setPostText((prevText) => prevText + ` [Link](${url})`);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      setShowSearchBar(false);
    }
  };

  const markAllNotificationsAsRead = () => {
    setUnreadNotifications(0);
  };

  const handlePostInteraction = (postId, type) => {
    const currentInteractions = postInteractions[postId] || {};
    if (type === 'like') {
      const currentLikeState = currentInteractions.liked || false;
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likes: currentLikeState ? post.likes - 1 : post.likes + 1
          };
        }
        return post;
      }));
      setPostInteractions({
        ...postInteractions,
        [postId]: { ...currentInteractions, liked: !currentLikeState, disliked: false }
      });
    } else if (type === 'dislike') {
      const currentDislikeState = currentInteractions.disliked || false;
      setPostInteractions({
        ...postInteractions,
        [postId]: { ...currentInteractions, disliked: !currentDislikeState, liked: false }
      });
    }
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
                <div className="dropdown-item">
                  <button onClick={handleLogoutClick}>
                  <FaSignOutAlt /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Left Menu */}
      <div className={`left-menu ${showLeftMenu ? 'show' : ''}`}>
        <NavLink exact to="/home" className="menu-item" activeClassName="active">
          <FaHome className="icon" /> Home
        </NavLink>
        <NavLink to="/communities" className="menu-item" activeClassName="active">
          <FaUsers className="icon" /> Communities
        </NavLink>
        <NavLink to="/ai" className="menu-item" activeClassName="active">
          <FaComments className="icon" /> AI
        </NavLink>
        <NavLink to="/messages" className="menu-item" activeClassName="active">
          <FaUsers className="icon" /> Messages
        </NavLink>
        <NavLink to="/settings" className="menu-item" activeClassName="active">
          <FaCog className="icon" /> Settings
        </NavLink>

        <div className="featured-communities">
          <h3 className="section-title">
            <FaUsers className="section-icon" /> Featured
          </h3>
          <div className="community-list">
            <div className="community-item">
              <FaRocket className="community-icon" />
              <span className="community-name">Tech Hub</span>
              <span className="member-count">2.4k</span>
            </div>
            <div className="community-item">
              <FaPalette className="community-icon" />
              <span className="community-name">Designers</span>
              <span className="member-count">1.8k</span>
            </div>
            <div className="community-item">
              <FaLeaf className="community-icon" />
              <span className="community-name">Eco Life</span>
              <span className="member-count">956</span>
            </div>
          </div>
          <button className="see-more-btn">
            <FaChevronRight /> See All
          </button>
        </div>

        <div className="profile-summary">
          <img src="https://via.placeholder.com/40" alt="Profile" className="profile-pic" />
          <div className="profile-info">
            <h4>Your Name</h4>
            <p>@username</p>
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
              <span className="voice-icon">🎤</span> Voice
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
              {post.image && <img src={post.image} alt="Post" className="post-media" />}
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
        <div className="Trending">
          <h3 className="section-header">
            <FaRocket className="header-icon" /> Trending
            <FaSlidersH className="filter-icon" />
          </h3>
          <div className="feed-item trending">
            <div className="trend-meta">
              <span className="trend-category">Tech</span>
              <span className="trend-time">2h ago</span>
            </div>
            <p className="trend-text">AI breakthroughs in renewable energy solutions</p>
            <div className="engagement-metrics">
              <span><FaChartLine /> 1.4K engagements</span>
              <button className="save-btn"><FaBookmark /></button>
            </div>
          </div>
          <div className="feed-item personalized">
            <div className="content-type">
              <FaVideo className="type-icon" /> Live Stream
            </div>
            <p className="content-title">SpaceX Launch Watch Party</p>
            <div className="live-stats">
              <span className="live-dot"></span>
              12.8K viewers
            </div>
          </div>
        </div>

        <div className="echo-spaces">
          <h3 className="section-header">
            <FaHeadphones className="header-icon" /> Interactive Spaces
          </h3>
          <div className="space-card audio">
            <div className="space-header">
              <FaPodcast className="space-icon" />
              <div className="space-info">
                <h4>Tech Talks Daily</h4>
                <p>Hosted by TechCrunch</p>
              </div>
            </div>
            <div className="space-actions">
              <button className="join-space-btn">
                <FaMicrophone /> Join
              </button>
            </div>
          </div>
          <div className="space-card chat">
            <div className="space-header">
              <FaComments className="space-icon" />
              <div className="space-info">
                <h4>Design Critique</h4>
                <p>342 participants</p>
              </div>
            </div>
            <div className="space-preview">
              <p className="recent-message">
                <strong>Sarah:</strong> What about using neumorphism here?
              </p>
            </div>
          </div>
        </div>

        <div className="context-help">
          <FaQuestionCircle className="help-icon" />
          <p>Need help navigating?</p>
          <button className="quick-help-btn">
            <FaMagic /> Smart Assist
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

/* import React, { useState, useEffect } from 'react';
import { FaHome, FaComments, FaUsers, FaBell, FaMoon, FaPlus, FaUser, FaCog, 
  FaSignOutAlt, FaArrowUp, FaArrowDown, FaComment, FaImage, FaSmile, FaLink, FaShare,
  FaBookmark, FaEllipsisH, FaSun, FaTimes, FaBars, FaRocket, FaChevronRight, FaPalette, FaLeaf, FaMicrophone, FaSearch, FaSlidersH, FaChartLine, FaHeadphones, FaPodcast, FaVideo, FaCompass, FaStar, FaQuestionCircle, FaMagic } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = ({ setIsAuthenticated }) => { // Receive state updater from props
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false); // Update parent state
    navigate("/login");
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
  const navigate = useNavigate();

  // Sample posts data
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
}

  return (
    <div className={`homepage-container ${isDarkMode ? 'dark-mode' : ''}`}>
      {// Top Bar }
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
                    <strong>User3</strong> would like to be your moot
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
                <button className="dropdown-item" button onClick={handleLogout}>
                  <FaSignOutAlt /> Logout 
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {// Left Menu }
      <div className={`left-menu ${showLeftMenu ? 'show' : ''}`}>
      <NavLink exact to="/" className="menu-item" activeClassName="active">
        <FaHome className="icon" /> Home
      </NavLink>
      <NavLink to="/communities" className="menu-item" activeClassName="active">
        <FaUsers className="icon" /> Communities
      </NavLink>
      <NavLink to="/ai" className="menu-item" activeClassName="active">
        <FaComments className="icon" /> AI
      </NavLink>
      <NavLink to="/messages" className="menu-item" activeClassName="active">
        <FaUsers className="icon" /> Messages
      </NavLink>
      <NavLink to="/settings" className="menu-item" activeClassName="active">
        <FaCog className="icon" /> Settings
      </NavLink>

      <div className="featured-communities">
        <h3 className="section-title">
          <FaUsers className="section-icon" /> Featured
        </h3>
        <div className="community-list">
          {// Community items (keep 3-4 items max) }
          <div className="community-item">
            <FaRocket className="community-icon" />
            <span className="community-name">Tech Hub</span>
            <span className="member-count">2.4k</span>
          </div>
          <div className="community-item">
            <FaPalette className="community-icon" />
            <span className="community-name">Designers</span>
            <span className="member-count">1.8k</span>
          </div>
          <div className="community-item">
            <FaLeaf className="community-icon" />
            <span className="community-name">Eco Life</span>
            <span className="member-count">956</span>
          </div>
        </div>
        <button className="see-more-btn">
          <FaChevronRight /> See All
        </button>
      </div>
        {// Fixed Profile Section}
      <div className="profile-summary">
        <img src="https://via.placeholder.com/40" alt="Profile" className="profile-pic" />
        <div className="profile-info">
          <h4>Your Name</h4>
          <p>@username</p>
        </div>
      </div>
      </div>

      {// Main Content }
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
              <span className="voice-icon">🎤</span> Voice
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

        {// Feed }
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
                
                {// Comment section }
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

      {// Right Sidebar }
      <div className="right-sidebar">
        {// Trending Section }
        <div className="Trending">
          <h3 className="section-header">
            <FaRocket className="header-icon" /> Trending
            <FaSlidersH className="filter-icon" />
          </h3>
          
          <div className="feed-item trending">
            <div className="trend-meta">
              <span className="trend-category">Tech</span>
              <span className="trend-time">2h ago</span>
            </div>
            <p className="trend-text">AI breakthroughs in renewable energy solutions</p>
            <div className="engagement-metrics">
              <span><FaChartLine /> 1.4K engagements</span>
              <button className="save-btn"><FaBookmark /></button>
            </div>
          </div>

          <div className="feed-item personalized">
            <div className="content-type">
              <FaVideo className="type-icon" /> Live Stream
            </div>
            <p className="content-title">SpaceX Launch Watch Party</p>
            <div className="live-stats">
              <span className="live-dot"></span>
              12.8K viewers
            </div>
          </div>
        </div>

        {// Echo Spaces }
        <div className="echo-spaces">
          <h3 className="section-header">
            <FaHeadphones className="header-icon" /> Interactive Spaces
          </h3>
          
          <div className="space-card audio">
            <div className="space-header">
              <FaPodcast className="space-icon" />
              <div className="space-info">
                <h4>Tech Talks Daily</h4>
                <p>Hosted by TechCrunch</p>
              </div>
            </div>
            <div className="space-actions">
              <button className="join-space-btn">
                <FaMicrophone /> Join
              </button>
            </div>
          </div>

          <div className="space-card chat">
            <div className="space-header">
              <FaComments className="space-icon" />
              <div className="space-info">
                <h4>Design Critique</h4>
                <p>342 participants</p>
              </div>
            </div>
            <div className="space-preview">
              <p className="recent-message">
                <strong>Sarah:</strong> What about using neumorphism here?
              </p>
            </div>
          </div>
        </div>

        {// Contextual Help }
        <div className="context-help">
          <FaQuestionCircle className="help-icon" />
          <p>Need help navigating?</p>
          <button className="quick-help-btn">
            <FaMagic /> Smart Assist
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
*/