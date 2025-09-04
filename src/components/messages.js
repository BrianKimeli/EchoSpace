import React, { useState } from 'react';
import './messages.css';

const Messages = () => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hey team! Ready for the launch? 🚀', sender: 'jane', timestamp: '10:30 AM' },
    { id: 2, text: 'Absolutely! Just finished the final checks.', sender: 'user', timestamp: '10:31 AM' },
    { id: 3, text: 'Marketing assets are all set 🎯', sender: 'mike', timestamp: '10:32 AM' },
  ]);

  const [channels] = useState([
    { id: 1, name: '# general-chat', category: 'Text Channels' },
    { id: 2, name: '# Software-engineers', category: 'Project Groups' },
    { id: 3, name: '# dev-updates', category: 'Project Groups' },
    { id: 4, name: 'Announcements', category: 'System' },
  ]);

  const [activeChannel, setActiveChannel] = useState(channels[0]);
  const [events] = useState([
    { id: 1, title: 'Product Launch', time: '2:00 PM', date: 'Tomorrow' },
    { id: 2, title: 'Team Sync', time: '10:00 AM', date: 'Fri' },
  ]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        text: newMessage,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');
    }
  };

  return (
    <div className="messaging-container">
      {/* Left Sidebar */}
      <div className="sidebar-left">
        <div className="server-header">
          <h2>EchoSpace</h2>
          <Link to="/" className="back-link">← Back</Link>
        </div>
        
        <div className="channels-list">
          {channels.map((channel) => (
            <div 
              key={channel.id}
              className={`channel-item ${activeChannel.id === channel.id ? 'active' : ''}`}
              onClick={() => setActiveChannel(channel)}
            >
              <span className="channel-prefix">#</span>
              {channel.name}
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="main-chat">
        <div className="chat-header">
          <h3>{activeChannel.name}</h3>
          <div className="header-actions">
            <button className="icon-btn" title="Add User">👥</button>
            <button className="icon-btn" title="Settings">⚙️</button>
          </div>
        </div>

        <div className="chat-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.sender === 'user' ? 'user' : ''}`}>
              <div className="avatar">
                {message.sender === 'user' ? '👤' : '🤖'}
              </div>
              <div className="message-content">
                <div className="message-bubble">
                  <p>{message.text}</p>
                  <span className="timestamp">{message.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <form className="message-input" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder={`Message ${activeChannel.name}`}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button type="submit" className="send-btn">
            📤
          </button>
        </form>
      </div>

      {/* Right Sidebar */}
      <div className="sidebar-right">
        <div className="user-profile">
          <div className="avatar-large">👤</div>
          <h4>{currentUser?.name || "Your Name"}</h4>
          <p>@{currentUser?.username || "username"}</p>
        </div>

        <div className="upcoming-events">
          <h4>Upcoming Events</h4>
          {events.map((event) => (
            <div key={event.id} className="event-item">
              <div className="event-date">
                <span className="date">{event.date}</span>
                <span className="time">{event.time}</span>
              </div>
              <div className="event-title">{event.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Messages;