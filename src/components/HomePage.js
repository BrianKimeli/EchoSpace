import React, { useState, useEffect, useCallback, useContext } from 'react';
import { 
  FaHome, FaImage, FaLink, FaComment, FaShare, FaArrowUp, FaArrowDown, FaUsers, FaComments, FaBell, 
  FaMoon, FaSignOutAlt, FaSun, FaBars, FaSearch, FaUser, FaCog, FaPlus, FaRocket, FaChevronRight, 
  FaPalette, FaLeaf, FaMicrophone, FaEllipsisH, FaChartLine, FaTimes, FaBookmark, FaQuestionCircle, 
  FaMagic, FaVideo, FaSlidersH, FaHeadphones, FaPodcast 
} from 'react-icons/fa';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import './HomePage.css';

const HomePage = ({ handleLogout }) => {
  const navigate = useNavigate();
  const handleLogoutClick = () => {
    handleLogout();
    navigate('/login');
  };

  const { currentUser } = useContext(UserContext);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [postText, setPostText] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(2);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showLeftMenu, setShowLeftMenu] = useState(false);
  const [commentInputs, setCommentInputs] = useState({});
  const [warning, setWarning] = useState('');
  const [posts, setPosts] = useState([]);
  const [postInteractions, setPostInteractions] = useState({});
  // Remove the problematic immediate state update that causes infinite re-render
  // (Do not call setPosts directly in the render body.)

  const [commentsVisible, setCommentsVisible] = useState({});

  const toggleComments = (postId) => {
    setCommentsVisible(prevState => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };

  // Removed unused variable causing the error

  const handleCommentSubmit = (postId) => {
    const content = commentInputs[postId]?.trim();
    if (!content) return;
    const newComment = {
      _id: `c${Date.now()}`,
      content,
      userId: currentUser?._id,
      createdAt: new Date()
    };
    setPosts(prevPosts => prevPosts.map(post => {
      if (post._id === postId) {
        return {
          ...post,
          comments: [...(post.comments || []), newComment]
        };
      }
      return post;
    }));
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
    if (savedDarkMode) document.body.classList.add('dark-mode');
  }, []);

  const toggleDarkMode = () => {
    const newDarkModeState = !isDarkMode;
    setIsDarkMode(newDarkModeState);
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', newDarkModeState);
  };

  const forbiddenWords = ['hate', 'kill', 'destroy'];
  const checkForForbiddenWords = (content) => {
    return forbiddenWords.some(word => new RegExp(`\\b${word}\\b`, 'i').test(content));
  };

  const checkContentSafety = async (content) => {
    try {
      const response = await fetch('/api/moderate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ content })
      });
      const { isSafe } = await response.json();
      return isSafe;
    } catch (error) {
      console.error('Moderation check failed:', error);
      return true;
    }
  };

  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/posts');
      if (response.ok) {
        const data = await response.json();
        setPosts(data.map(post => ({
          ...post,
          comments: post.comments || []
        })));
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleNewPost = async () => {
    if (postText.trim() || imagePreview) {
      if (checkForForbiddenWords(postText)) {
        setWarning('⚠ Your post contains language that may be considered harmful. Please modify your content.');
        setTimeout(() => setWarning(''), 3000);
        return;
      }
      if (!currentUser || !currentUser._id) {
        alert('User information is not available. Please try logging in again.');
        return;
      }
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            userId: currentUser._id,
            content: postText,
            image: imagePreview
          })
        });
        if (response.ok) {
          const newPost = await response.json();
          setPosts([newPost, ...posts]);
          setPostText('');
          setImagePreview(null);
        } else {
          const errorData = await response.json();
          console.error('Error creating post:', errorData);
          alert('Failed to create post.');
        }
      } catch (error) {
        console.error('Error creating post:', error);
        alert('Failed to connect to the server to create post.');
      }
    } else {
      alert('Please add some text or an image to post!');
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImagePreview = () => setImagePreview(null);

  const handleAddLink = () => {
    const url = prompt('Enter the URL:');
    if (url) {
      setPostText(prevText => prevText + ` [Link](${url})`);
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
    setPosts(prevPosts => prevPosts.map(post => {
      if (post._id === postId) {
        const currentLikes = post.likes || 0;
        return {
          ...post,
          likes: type === 'like' ? currentLikes + 1 : currentLikes - 1
        };
      }
      return post;
    }));
    setPostInteractions(prev => ({
      ...prev,
      [postId]: {
        liked: type === 'like' ? !prev[postId]?.liked : false,
        disliked: type === 'dislike' ? !prev[postId]?.disliked : false
      }
    }));
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
              src={currentUser?.profilePicture || '/default-avatar.png'} 
              alt="Profile" 
              className="profile-pic" 
              onClick={() => setShowProfileDropdown(prev => !prev)}
            />
            <span className="username">@{currentUser?.username || "Username"}</span>
            {showProfileDropdown && (
              <div className="dropdown-menu">
                <div className="dropdown-item"><Link to="/profile"><FaUser /> Profile</Link></div>
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
          <img src={currentUser?.profilePicture || '/default-avatar.png'} alt="Profile" className="profile-pic" />
          <div className="profile-info">
            <h4>{currentUser?.name || "Your Name"}</h4>
            <p>@{currentUser?.username || "username"}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {warning && <div className="warning">{warning}</div>}
        <div className="post-box">
          <div className="post-box-header">
            <img src={currentUser?.profilePicture || "https://via.placeholder.com/50"} alt="Profile" className="profile-pic-post" />
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
            <div className="post" key={post._id} style={{ position: 'relative' }}>
              {post.flagged ? (
                <div className="flag-alert">
                  This post has been flagged for review and is currently hidden.
                </div>
              ) : (
                <>
                  <div className="post-header">
                    <div className="post-author">
                      <img 
                        src={post.userId?.profilePicture || '/default-avatar.png'} 
                        alt={post.userId?.username} 
                        className="post-author-pic" 
                      />
                      <div className="post-author-info">
                        <div className="post-author-name">
                          {post.userId?.username || 'Unknown User'}
                        </div>
                        <div className="post-time">
                          {new Date(post.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                    <button className="post-options-btn">
                      <FaEllipsisH />
                    </button>
                  </div>
                  <div className="post-text">{post.content}</div>
                  {post.image && <img src={post.image} alt="Post" className="post-media" />}
                  <div className="post-content">
                    <div className="post-stats">
                      <span>{post.likes} likes</span>
                      <span>{(post.comments || []).length} comments</span>
                    </div>
                    <div className="post-interactions">
                      <button 
                        className={`upvote-btn ${postInteractions[post._id]?.liked ? 'active' : ''}`}
                        onClick={() => handlePostInteraction(post.id, 'like')}
                      >
                        <FaArrowUp /> Like
                      </button>
                      <button 
                        className={`downvote-btn ${postInteractions[post._id]?.disliked ? 'active' : ''}`}
                        onClick={() => handlePostInteraction(post.id, 'dislike')}
                      >
                        <FaArrowDown /> Dislike
                      </button>
                      <button className="comment-btn" onClick={() => toggleComments(post._id)}>
                        <FaComment /> Comment
                      </button>
                      <button className="share-btn">
                        <FaShare /> Share
                      </button>
                      <button className="bookmark-btn">
                        <FaBookmark /> Save
                      </button>
                    </div>
                    <div className={`comments-section ${commentsVisible[post._id] ? '' : 'collapsed'}`}>
                      {Array.isArray(post.comments) && post.comments.length > 0 ? (
                        post.comments.map(comment => (
                          <div key={comment._id} className="comment">
                            <img
                              src={comment.userId?.profilePicture || '/default-avatar.png'}
                              alt={comment.userId?.username}
                              className="comment-profile-pic"
                            />
                            <div className="comment-content">
                              <span className="comment-author">
                                @{comment.userId?.username}
                              </span>
                              {comment.content}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="no-comments">No comments yet</p>
                      )}
                      <div className="comment-input-container">
                        <input
                          type="text"
                          className="comment-input"
                          placeholder="Write a comment..."
                          value={commentInputs[post._id] || ''}
                          onChange={(e) =>
                            setCommentInputs(prev => ({ ...prev, [post._id]: e.target.value }))
                          }
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleCommentSubmit(post._id);
                            }
                          }}
                        />
                        <button onClick={() => handleCommentSubmit(post._id)}>Post</button>
                      </div>
                    </div>
                  </div>
                </>
              )}
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