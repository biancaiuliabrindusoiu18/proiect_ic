import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../imag/logo.png';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

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
      const response = await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, { password: newPassword });
      setMessage(response.data.msg);
      setError('');
    } catch (err) {
      setError('Error: ' + err.response.data.msg);
      setMessage('');
    }
  };

  return (
    <section className="flex justify-center items-center p-5 min-h-screen bg-gray-100">
      <main className="p-10 w-full bg-white rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.05)] 
                      max-w-[800px] mx-auto w-full max-md:max-w-[800px] max-sm:max-w-[90%]
                      flex flex-col justify-center min-h-[80vh] min-w-[60vh]">
        <div className="max-w-[90%] mx-auto">

          {/* Header Section */}
          <header className="flex flex-col items-center mb-5">
            <img
              src={Logo}
              alt="Medical icon"
              className="mb-2.5 w-3.5 h-3"
            />
            <h1 className="mb-1.5 text-2xl text-gray-500 max-sm:text-xl">
              MedTrack
            </h1>
            <p className="text-sm font-light text-center text-gray-400 max-sm:text-xs">
              Reset your password securely.
            </p>
          </header>

          <div className="mb-5 h-px bg-gray-200" />

          {error && (
            <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
          )}

          {message && (
            <div className="text-green-500 text-sm mb-4 text-center">{message}</div>
          )}

          <form className="flex flex-col" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1.5 mb-3">
              <label htmlFor="newPassword" className="flex align-left font-light text-zinc-400">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-lg border border-solid transition-all border-slate-200 duration-[0.2s] ease-[ease]"
                placeholder="********"
              />
            </div>

            <div className="flex flex-col gap-1.5 mb-5">
              <label htmlFor="confirmPassword" className="flex align-left font-light text-zinc-400">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-solid transition-all border-slate-200 duration-[0.2s] ease-[ease]"
                placeholder="********"
              />
            </div>

            <button
              type="submit"
              className="p-3.5 w-full text-sm font-light text-white bg-blue-600 rounded-lg transition-all cursor-pointer border-[none] duration-[0.2s] ease-[ease] hover:bg-blue-700"
            >
              Reset Password
            </button>
          </form>
        </div>
      </main>
    </section>
  );
};

export default ResetPassword;
