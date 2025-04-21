import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const Comment = ({ comment }) => {
  return (
    <div className="comment-item">
      <img 
        src={comment.user.profilePicture} 
        alt={comment.user.username}
        className="comment-avatar"
      />
      <div className="comment-content">
        <div className="comment-header">
          <span className="comment-username">{comment.user.username}</span>
          <span className="comment-time">
            {formatDistanceToNow(new Date(comment.createdAt))} ago
          </span>
        </div>
        <p className="comment-text">{comment.content}</p>
      </div>
    </div>
  );
};

export default Comment;