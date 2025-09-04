import React, { useState, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import './HomePage.css';

const HomePage = () => {
  const { currentUser } = useContext(UserContext);
  const [posts] = useState([]);

  return (
    <div className="homepage">
      <div className="homepage-content">
        <h1>Welcome to EchoSpace</h1>
        <p>Connect, Share, Echo with the community</p>
        {currentUser && (
          <div className="user-welcome">
            <p>Hello, {currentUser.username || 'User'}!</p>
          </div>
        )}
        <div className="posts-container">
          {posts.length === 0 ? (
            <p>No posts yet. Start sharing!</p>
          ) : (
            posts.map((post, index) => (
              <div key={index} className="post">
                {post.content}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;