import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css";

const Auth = ({ isLogin: initialIsLogin, setIsAuthenticated, onSignupSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleToggleForm = () => {
    setIsLogin(!isLogin);
    setError("");
    // Clear username when switching to login mode
    if (isLogin) setUsername("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate required fields
    const missingFields = [];
    if (!isLogin && !username.trim()) missingFields.push("username");
    if (!email.trim()) missingFields.push("email");
    if (!password.trim()) missingFields.push("password");

    if (missingFields.length > 0) {
      setError(`Please fill in: ${missingFields.join(", ")}`);
      setLoading(false);
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    // Password strength validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      // Mock authentication for demo purposes
      const mockToken = `mock_token_${Date.now()}`;
      localStorage.setItem("token", mockToken);
      
      if (isLogin) {
        setIsAuthenticated(true);
        navigate("/");
      } else {
        navigate("/profilesetup");
      }
    } catch (err) {
      setError("Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="logo-container">
        <img src="https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg?auto=compress&cs=tinysrgb&w=300" alt="EchoSpace Logo" className="logo" />
      </div>
      <div className="left-side">
        <h1>EchoSpace</h1>
        <p className="tagline">Connect. Share. Echo.</p>
      </div>
      <div className="right-side">
        <div className="auth-container">
          <h2>{isLogin ? "Login" : "Create an EchoSpace Account"}</h2>
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  placeholder="Enter username"
                  autoComplete="username"
                />
              </div>
            )}
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                placeholder="Enter email"
                autoComplete="email"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                placeholder="Enter password"
                autoComplete={isLogin ? "current-password" : "new-password"}
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            }
            <button type="submit" id="submit-button" disabled={loading} className={loading ? "loading" : ""}>
              {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
            </button>
          </form>
          <div className="toggle-form">
            <span>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button id="toggle-button" onClick={handleToggleForm} disabled={loading}>
                {isLogin ? "Sign Up" : "Login"}
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;