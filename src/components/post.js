import React, { useState, useEffect } from 'react';
import Comment from './comment';

const Post = ({ post }) => {
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/posts/${post._id}/comments`);
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      }
    };
    
    if (showComments) fetchComments();
  }, [showComments, post._id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`/api/posts/${post._id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ content: newComment })
      });

      const updatedComments = await response.json();
      setComments(updatedComments);
      setNewComment('');
    } catch (error) {
      console.error('Failed to post comment:', error);
    }
  };

  return (
    <div className="post-card">
      {/* Existing post content */}
      
      <div className="comments-section">
        <button 
          className="toggle-comments"
          onClick={() => setShowComments(!showComments)}
        >
          {showComments ? 'Hide' : 'View'} Comments ({comments.length})
        </button>

        {showComments && (
          <>
            <div className="comments-list">
              {comments.map(comment => (
                <Comment key={comment._id} comment={comment} />
              ))}
            </div>

            <form onSubmit={handleCommentSubmit} className="comment-form">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="comment-input"
              />
              <button type="submit" className="comment-submit">
                Post
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};