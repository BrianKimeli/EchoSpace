import React, { useState } from 'react';
import './styles.css';
import logo from './public./images/logo.jpg'; // Adjust the logo path based on your file structure

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginMessage, setLoginMessage] = useState('');
  const [signupMessage, setSignupMessage] = useState('');

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setLoginMessage('');
    setSignupMessage('');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const formData = {
      username: e.target.username.value,
      password: e.target.password.value,
    };

    // Replace this with your actual login API
    fetch('login.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success') {
          window.location.href = 'dashboard.php'; // Redirect on success
        } else {
          setLoginMessage(data.message);
        }
      })
      .catch(() => {
        setLoginMessage('An error occurred. Please try again.');
      });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    const formData = {
      username: e.target.username.value,
      email: e.target.email.value,
      password: e.target.password.value,
    };

    // Replace this with your actual signup API
    fetch('signup.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success') {
          setSignupMessage('Signup successful! Please log in.');
        } else {
          setSignupMessage(data.message);
        }
      })
      .catch(() => {
        setSignupMessage('An error occurred. Please try again.');
      });
  };

  return (
    <div className="container">
      {/* Left Side */}
      <div className="left-side">
        <h1>EchoSpace</h1>
        <div className="logo-container">
          <img src={logo} alt="EchoSpace Logo" className="logo" />
        </div>
      </div>

      {/* Right Side */}
      <div className="right-side">
        <div className="auth-container">
          <h2>{isLogin ? 'Login' : 'Create an EchoSpace Account'}</h2>

          {isLogin ? (
            <form id="loginForm" onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="loginUsername">Username:</label>
                <input type="text" id="loginUsername" name="username" required />
              </div>
              <div className="form-group">
                <label htmlFor="loginPassword">Password:</label>
                <input type="password" id="loginPassword" name="password" required />
              </div>
              <div className="form-group">
                <button type="submit">Login</button>
              </div>
              <p>
                Don't have an account? <a href="#!" onClick={handleToggle}>Sign up here</a>
              </p>
              <p id="loginMessage" style={{ color: 'red' }}>{loginMessage}</p>
            </form>
          ) : (
            <form id="signupForm" onSubmit={handleSignup}>
              <div className="form-group">
                <label htmlFor="signupUsername">Username:</label>
                <input type="text" id="signupUsername" name="username" required />
              </div>
              <div className="form-group">
                <label htmlFor="signupEmail">Email:</label>
                <input type="email" id="signupEmail" name="email" required />
              </div>
              <div className="form-group">
                <label htmlFor="signupPassword">Password:</label>
                <input type="password" id="signupPassword" name="password" required />
              </div>
              <div className="form-group">
                <button type="submit">Sign Up</button>
              </div>
              <p>
                Already have an account? <a href="#!" onClick={handleToggle}>Login here</a>
              </p>
              <p id="signupMessage" style={{ color: signupMessage === 'Signup successful! Please log in.' ? 'green' : 'red' }}>{signupMessage}</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
