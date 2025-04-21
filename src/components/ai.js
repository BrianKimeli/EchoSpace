import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ai.css';

const AIPage = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // DeepSeek API Configuration
    const API_URL = 'https://api.deepseek.com/v1/chat/completions';
    const API_KEY = 'sk-d2599d1e1c6542209f54cd1ca0b52304';
    
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

            const response = await axios.post(API_URL, {
                model: "deepseek-chat",
                messages: [...messages, newMessage],
                temperature: 0.7,
                max_tokens: 500
            }, {
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            const aiResponse = response.data.choices[0].message.content;
            setMessages(prev => [...prev, {
                role: "assistant",
                content: aiResponse
            }]);
            
        } catch (error) {
            console.error("AI Error:", error);
            setMessages(prev => [...prev, {
                role: "assistant",
                content: "⚠️ Error: " + (error.response?.data?.error?.message || "Service unavailable")
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
                <Link to="/home" className="home-link">← Home</Link>
                <h1>AI Chat</h1>
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
                            dangerouslySetInnerHTML={{ __html: msg.content }}
                        />
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