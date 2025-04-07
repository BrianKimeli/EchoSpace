import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ai.css';

const AIPage = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [handleKeyDown, setHandleKeyDown] = useState(null);

    // Add this useEffect to set the welcome message when the component mounts
    useEffect(() => {
        setMessages([
            { 
                role: "assistant", 
                content: "Welcome to EchoSpace AI. How can I help you today?"
            }
        ]);
    }, []);

// Update the handleSendMessage function
const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    try {
      const newMessage = { role: "user", content: input };
      setMessages((prev) => [...prev, newMessage]);
      setInput('');
      setLoading(true);
  
      const res = await axios.post('http://localhost:5000/api/ai', 
        { message: input },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
  
      const botReply = {
        role: "assistant",
        content: res.data.generated_text.replace(/\n/g, '<br>') // Handle newlines
      };
  
      setMessages((prev) => [...prev, botReply]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [...prev, { 
        role: "assistant", 
        content: "⚠️ Failed to get response. Please try again later."
      }]);
    } finally {
      setLoading(false);
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { // Check for Enter key without Shift
            e.preventDefault(); // Prevent default behavior of textarea
            handleSendMessage(); // Call the send message function
        }
  };

        return (
            <div className="ai-container">
                <nav className="ai-navbar">
                    <Link to="/home" className="home-link">← Home</Link>
                    <h1>AI Chat</h1>
                </nav>
                {/* Update the message rendering */}
                <div className="chat-box">
                    {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.role}`}>
                        <div className="message-header">
                        <span className="role-badge">
                            {msg.role === "user" ? "You" : "EchoAI"}
                        </span>
                        </div>
                        <div className="message-content" 
                            dangerouslySetInnerHTML={{ __html: msg.content }} />
                    </div>
                    ))}
                    {loading && (
                    <div className="message assistant">
                        <div className="typing-indicator">
                        <span></span><span></span><span></span>
                        </div>
                    </div>
                    )}
                </div>
                <div className="input-box">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask something..."
                        onKeyDown={handleKeyDown}
                    />
                    <button onClick={handleSendMessage} className="send-btn" disabled={loading}>
                        {loading ? "..." : "Send"}
                    </button>
                </div>
            </div>
        );
    };
};

export default AIPage;