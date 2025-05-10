import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import Logo from '../imag/logo.png'; // Import the logo image
import './auth.css'; //  Import the CSS file for styling
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birth_date, setBirth_date] = useState('');
  const [sex, setSex] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        account: email,
        password,
        firstName,
        lastName,
        birth_date,
        sex
      });

      console.log('Registration successful:', response.data);
      setError('');

      window.location.href = '/register-success'; // Redirect to a success page
    } catch (err) {
      console.error(err);
      if (err.response?.data?.msg) {
        setError(err.response.data.msg);
      } else {
        setError('There was an error during registration.');
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
          {error && <div className="error-message">{error}</div>}

          {/* Register Form */}
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Example: Elon"
              />
            </div>

            <div>
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Example: Musk"
              />
            </div>

            <div>
              <label htmlFor="birth_date">Date of Birth</label>
              <input
                type="date"
                id="birth_date"
                value={birth_date}
                onChange={(e) => setBirth_date(e.target.value)}
              />
            </div>

            <div className="radio-group">
              <label htmlFor="sex">Sex</label>
              <div className="radio-options">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="sex"
                    value="male"
                    checked={sex === 'male'}
                    onChange={() => setSex('male')}
                  />
                  Male
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="sex"
                    value="female"
                    checked={sex === 'female'}
                    onChange={() => setSex('female')}
                  />
                  Female
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Example: email@example.com"
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

            <div className="password-field">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="password-input-container">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Example: Password123"
                  required
                />
                <button 
                  type="button" 
                  className="password-toggle-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button type="submit">Register</button>
          </form>
        </div>
      </main>
    </section>
  );
};

export default Register;
