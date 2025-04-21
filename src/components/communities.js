import React, { useState } from 'react';
import './communities.css';

export default function Communities() {
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const featuredCommunities = [
    { name: 'Tech World', description: 'Latest in technology and innovation.', members: 450 },
    { name: 'Art Lovers', description: 'Explore the world of art.', members: 320 },
    { name: 'Science Hub', description: 'Scientific discussions and discoveries.', members: 290 },
  ];

  const recentPosts = [
    { title: 'Future of AI', snippet: 'Discussing AI developments in 2025...', community: 'Tech World' },
    { title: 'Famous Paintings', snippet: 'Exploring classic and modern art...', community: 'Art Lovers' },
  ];

  const handleJoinCommunity = (communityName) => {
    if (!joinedCommunities.includes(communityName)) {
      setJoinedCommunities([...joinedCommunities, communityName]);
    }
  };

  return (
    <div className="communities-page">
      {/* Header */}
      <header className="communities-header">
        <div className="logo">EchoSpace</div>
        <input type="text" className="search-bar" placeholder="Search Communities..." />
        <div className="profile-icons">
          <span className="profile-pic">👤</span>
          <span className="notifications">🔔</span>
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
          </ul>
          <button className="create-community">Create Community</button>
          <h4>Your Communities</h4>
          <ul>
            {joinedCommunities.map((community, index) => (
              <li key={index}>{community}</li>
            ))}
          </ul>
        </aside>

        {/* Featured Communities Section */}
        <section className="featured-communities">
          <h2>Featured Communities</h2>
          <div className="community-grid">
            {featuredCommunities.map((community, index) => (
              <div key={index} className="community-card">
                <h3>{community.name}</h3>
                <p>{community.description}</p>
                <p>{community.members} Members</p>
                <button
                  onClick={() => handleJoinCommunity(community.name)}
                >
                  {joinedCommunities.includes(community.name) ? 'Leave' : 'Join'}
                </button>
              </div>
            ))}
          </div>
          {/* Pagination */}
          <div className="communities-pagination">
            <span>1</span>
            <span>2</span>
            <span>3</span>
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
