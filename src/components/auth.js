import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './auth.css';

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(''); // Define error state
  const navigate = useNavigate(); // Initialize navigate

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    if (isLogin) {
      // Handle login logic
      if (data.username === "testuser" && data.password === "password123") {
        onLogin(); // Simulate successful login
        navigate('/home'); // Navigate to homepage after login
      } else {
        setError('Invalid login credentials'); // Set error message for invalid login
      }
    } else {
      // Handle signup logic
      console.log('Signup data:', data);
      onLogin(); // Simulate successful signup
      navigate('/home'); // Navigate to homepage after signup
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
          <h2>{isLogin ? 'Login' : 'Create an EchoSpace Account'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input type="text" id={isLogin ? 'loginUsername' : 'signupUsername'} name="username" required />
            </div>
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input type="email" id="signupEmail" name="email" required />
              </div>
            )}
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input type="password" id={isLogin ? 'loginPassword' : 'signupPassword'} name="password" required />
            </div>
            <div className="form-group">
              <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
            </div>
            {error && <p className="error-message">{error}</p>} {/* Display error message */}
          </form>
          <p>
            {isLogin ? (
              <>
                Don't have an account? <a onClick={toggleForm}>Sign up here</a>
              </>
            ) : (
              <>
                Already have an account? <a onClick={toggleForm}>Login here</a>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
