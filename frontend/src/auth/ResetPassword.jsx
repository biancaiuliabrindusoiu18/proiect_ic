import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../imag/logo.png';
import './auth.css'; //  Import the CSS file for styling

const ResetPassword = () => {
  const { token } = useParams();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [formVisible, setFormVisible] = useState(true); // To control the visibility of the form

  useEffect(() => {
    // Check if token is valid and hasn't expired
    if (!token) {
      setError('Invalid or expired token');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (error) {
      // Don't proceed with the form submission if there's an error (invalid token)
      return;
    }

    if (!newPassword || !confirmPassword) {
      setError('Please enter and confirm your new password');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Send the token and new password to the backend
      const response = await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, { password: newPassword });
      setMessage(response.data.msg);
      setError('');
      setFormVisible(false); // Hide the form on successful submission
    } catch (err) {
      setError('Error: ' + err.response.data.msg);
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
            <p id="moto">Reset your password securely!</p>
          </header>

          <div className="mb-5 h-px bg-gray-200" />
          
          {/* Success or Error Message */}
          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}


          {formVisible && (  // Conditionally render the form based on the formVisible state
            <form onSubmit={handleSubmit}>
              <div >
                <label htmlFor="newPassword">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="********"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="********"
                />
              </div>

              <button
                type="submit"
              >
                Reset Password
              </button>
            </form>
          )}
        </div>
      </main>
    </section>
  );
};

export default ResetPassword;
