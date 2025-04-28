import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from '../imag/logo.png'; // Import the logo image
import './auth.css'; // Import the CSS file for styling

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/forgot-password', { account: email });
      setMessage(response.data.msg);
      setError('');
      setIsSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred');
      setMessage('');
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
            <p id="moto">Recover access to your health data</p>
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

          {/* Success or Error Message */}
          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}

          {/* Forgot Password Form */}
          {!isSubmitted && (
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

              <button type="submit">Send Reset Link</button>
            </form>
          )}
        </div>
      </main>
    </section>
  );
};

export default ForgotPassword;
