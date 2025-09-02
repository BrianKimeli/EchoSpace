import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ai.css';

const AIPage = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        setMessages([{
            role: "assistant",
            content: "Hi! I'm EchoSpace AI. How can I help you?"
        }]);
    }, []);

    const handleSendMessage = async () => {
        if (!input.trim()) return;
        
        try {
            const newMessage = { role: "user", content: input };
            setMessages(prev => [...prev, newMessage]);
            setInput('');
            setLoading(true);

            // Mock AI response for demo
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const responses = [
                "That's an interesting question! Let me help you with that.",
                "I understand what you're asking. Here's what I think...",
                "Great point! From my perspective, this could be approached in several ways.",
                "Thanks for sharing that with me. I'd be happy to discuss this further.",
                "That's a thoughtful question. Let me break this down for you."
            ];
            
            const aiResponse = responses[Math.floor(Math.random() * responses.length)];
            
            setMessages(prev => [...prev, {
                role: "assistant",
                content: aiResponse
            }]);
            
        } catch (error) {
            console.error("AI Error:", error);
            setMessages(prev => [...prev, {
                role: "assistant",
                content: "⚠️ Error: Service temporarily unavailable. Please try again later."
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };
    
    return (
        <div className="ai-container">
            <nav className="ai-navbar">
                <Link to="/" className="home-link">← Back to Home</Link>
                <h1>EchoSpace AI Assistant</h1>
            </nav>
            <div className="chat-box">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.role}`}>
                        <div className="message-header">
                            <span className="role-badge">
                                {msg.role === "user" ? "You" : "EchoAI"}
                            </span>
                        </div>
                        <div 
                            className="message-content"
                        >
                            {msg.content}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="message assistant">
                        <div className="message-header">
                            <span className="role-badge">EchoAI</span>
                        </div>
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
                    disabled={loading}
                />
                <button 
                    onClick={handleSendMessage}
                    className="send-btn"
                    disabled={loading}
                >
                    {loading ? "..." : "Send"}
                </button>
            </div>
        </div>
    );
};

export default AIPage;