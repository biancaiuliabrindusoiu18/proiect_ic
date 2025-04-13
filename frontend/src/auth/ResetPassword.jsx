import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const { token } = useParams(); // Token will be extracted from the URL
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Check if token is valid and hasn't expired
    if (!token) {
      setError('Invalid or expired token');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      const response = await axios.post('/api/auth/reset-password', { token, newPassword });
      setMessage(response.data.msg);
      setError('');
    } catch (err) {
      setError('Error: ' + err.response.data.msg);
      setMessage('');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Reset Your Password</h2>
        
        {message && <div className="text-green-500 text-sm mb-4">{message}</div>}
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="********"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="********"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 focus:outline-none"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
