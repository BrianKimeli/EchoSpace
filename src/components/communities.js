import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './communities.css';

export default function Communities() {
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const featuredCommunities = [
    { name: 'Tech World', description: 'Latest in technology and innovation.', members: 450 },
    { name: 'Art Lovers', description: 'Explore the world of art.', members: 320 },
    { name: 'Science Hub', description: 'Scientific discussions and discoveries.', members: 290 },
    { name: 'Music Makers', description: 'Share and discover amazing music.', members: 180 },
    { name: 'Book Club', description: 'Discuss your favorite books and authors.', members: 95 },
    { name: 'Fitness Journey', description: 'Motivation and tips for staying healthy.', members: 340 },
  ];

  const recentPosts = [
    { title: 'Future of AI', snippet: 'Discussing AI developments in 2025...', community: 'Tech World' },
    { title: 'Famous Paintings', snippet: 'Exploring classic and modern art...', community: 'Art Lovers' },
    { title: 'Space Exploration', snippet: 'Latest discoveries from Mars rover...', community: 'Science Hub' },
    { title: 'New Album Reviews', snippet: 'What are you listening to this week?', community: 'Music Makers' },
  ];

  const handleJoinCommunity = (communityName) => {
    if (!joinedCommunities.includes(communityName)) {
      setJoinedCommunities([...joinedCommunities, communityName]);
    } else {
      setJoinedCommunities(joinedCommunities.filter(name => name !== communityName));
    }
  };

  return (
    <div className="communities-page">
      {/* Header */}
      <header className="communities-header">
        <Link to="/" className="back-link">← Back</Link>
        <div className="logo">EchoSpace</div>
        <input type="text" className="search-bar" placeholder="Search Communities..." />
        <div className="profile-icons">
          <button className="icon-btn" title="Notifications">🔔</button>
          <button className="icon-btn" title="Profile">👤</button>
        </div>
      </header>

      {/* Main Body */}
      <div className="communities-main-body">
        {/* Sidebar */}
        <aside className="communities-sidebar">
          <h3>Categories</h3>
          <ul>
            <li>Technology</li>
            <li>Art</li>
            <li>Science</li>
            <li>Music</li>
            <li>Books</li>
            <li>Fitness</li>
            <li>Gaming</li>
            <li>Food</li>
          </ul>
          <button className="create-community">Create Community</button>
          {joinedCommunities.length > 0 && (
            <>
              <h4>Your Communities</h4>
              <ul className="joined-communities">
                {joinedCommunities.map((community, index) => (
                  <li key={index} className="joined-community-item">
                    <span className="community-indicator">●</span>
                    {community}
                  </li>
                ))}
              </ul>
            </>
          )}
        </aside>

        {/* Featured Communities Section */}
        <section className="featured-communities">
          <h2>Featured Communities</h2>
          <div className="community-grid">
            {featuredCommunities.map((community, index) => (
              <div key={index} className="community-card">
                <div className="community-icon">
                  {community.name === 'Tech World' && '💻'}
                  {community.name === 'Art Lovers' && '🎨'}
                  {community.name === 'Science Hub' && '🔬'}
                  {community.name === 'Music Makers' && '🎵'}
                  {community.name === 'Book Club' && '📚'}
                  {community.name === 'Fitness Journey' && '💪'}
                </div>
                <h3>{community.name}</h3>
                <p>{community.description}</p>
                <p className="member-count">{community.members} Members</p>
                <button
                  className={`join-btn ${joinedCommunities.includes(community.name) ? 'joined' : ''}`}
                  onClick={() => handleJoinCommunity(community.name)}
                >
                  {joinedCommunities.includes(community.name) ? 'Leave' : 'Join'}
                </button>
              </div>
            ))}
          </div>
          {/* Pagination */}
          <div className="communities-pagination">
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">3</button>
            <button className="page-btn">Next →</button>
          </div>
        </section>

        {/* Recent Posts Preview */}
        <aside className="recent-posts">
          <h4>Recent Posts</h4>
          <ul>
            {recentPosts.map((post, index) => (
              <li key={index}>
                <strong>{post.title}</strong>
                <p>{post.snippet}</p>
                <small>From {post.community}</small>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
