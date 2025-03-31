import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css";

const Auth = ({ isLogin: initialIsLogin, setIsAuthenticated }) => {
  const [isLogin, setIsLogin] = useState(initialIsLogin);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Sync local state with prop changes
  useEffect(() => {
    setIsLogin(initialIsLogin);
  }, [initialIsLogin]);

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

    try {
      const endpoint = isLogin ? "login" : "signup";
      const body = isLogin
        ? { email: email.trim(), password: password.trim() }
        : { username: username.trim(), email: email.trim(), password: password.trim() };

      const response = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      localStorage.setItem("token", data.token);
      setIsAuthenticated(true);
      navigate("/");
    } catch (err) {
      setError(err.message.replace(/['"]+/g, ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="logo-container">
        <img src="images/logo.jpg" alt="EchoSpace Logo" className="logo" />
      </div>
      <div className="left-side">
        <h1>EchoSpace</h1>
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
              />
            </div>
            {error && <div className="error-message">{error}</div>}
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