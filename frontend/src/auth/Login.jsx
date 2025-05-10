import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import Logo from '../imag/logo.png'; // Import the logo image
import './auth.css'; // Import the CSS file for styling
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [countdown, setCountdown] = useState(3); // countdown for redirect
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Check for existing token on page load
  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      navigate('/home');
    }
  }, [navigate]);

  useEffect(() => {
    let timer;

    if (countdown === 0) {
      window.location.href = '/home';
    }

    if (countdown > 0 && countdown !== 3) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 10);
    }

    return () => clearInterval(timer);
  }, [countdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        account: email,
        password,
        rememberMe
      });
      setMessage(response.data.msg);
    const token = response.data.token;
    const first_name = response.data.first_name;

      if (rememberMe) {
      localStorage.setItem('token', token); // saved for 7days
      localStorage.setItem('first_name', first_name); // Store first name
    } else {
      sessionStorage.setItem('token', token); // deleted when the tab is closed
      sessionStorage.setItem('first_name', first_name); // Store first name
    }
      console.log('Login successful:', response.data);

      setError('');
      setCountdown(2); // Start redirect countdown
    } catch (err) {
      console.error(err);
      if (err.response?.data?.msg) {
        setError(err.response.data.msg);
        setMessage('');
      } else {
        setError('An error occurred during login.');
        setMessage('');
      }
    }
  };

  return (
    <section>
      <main>
        <div id="whiteBox">
          {/* Header Section */}
          <header>
            <img src={Logo} alt="Medical icon" />
            <h1>MedTrack</h1>
            <p id="moto">Track your medical analysis with ease!</p>
          </header>

          {/* Navigation Tabs */}
          <nav>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className={`nav-button ${currentPath === "/login" ? "active" : "inactive"}`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => navigate("/register")}
              className={`nav-button ${currentPath === "/register" ? "active" : "inactive"}`}
            >
              Sign up
            </button>
          </nav>

          <div className="separator"></div>

          {/* Error Message */}
          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
              />
            </div>

            <div className="password-field">
              <label htmlFor="password">Password</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Example: Password123"
                  required
                />
                <button 
                  type="button" 
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>


            <div className="auth-options">
              <div className="remember-me">
                <label htmlFor="rememberMe" className="text-sm text-gray-700">
                  Stay logged in
                </label>
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
              </div>

              <div className="forgot-password">
                <a href="/forgot-password">Forgot password?</a>
              </div>
            </div>

            <button type="submit">Enter your account!</button>
          </form>
        </div>
      </main>
    </section>
  );
};

export default Login;
