import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from '../imag/logo.png';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/forgot-password', { account:email });
      setMessage(response.data.msg);
      setError('');
      setIsSubmitted(true);

    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred');
      setMessage('');
    }
  };

  return (
    <section className="flex justify-center items-center p-5 min-h-screen bg-gray-100">
      <main className="p-10 w-full bg-white rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.05)] 
                      max-w-[800px] mx-auto w-full max-md:max-w-[800px] max-sm:max-w-[90%]
                      flex flex-col justify-center min-h-[80vh] min-w-[60vh]">
        <div className="max-w-[90%] mx-auto">

          <header className="flex flex-col items-center mb-5">
            <img src={Logo} alt="Medical icon" className="mb-2.5 w-3.5 h-3" />
            <h1 className="mb-1.5 text-2xl text-gray-500 max-sm:text-xl">MedTrack</h1>
            <p className="text-sm font-light text-center text-gray-400 max-sm:text-xs">
              Recover access to your health data
            </p>
          </header>

          <nav className="flex justify-center">
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

          <div className="mb-5 h-px bg-gray-200" />

          {message && <div className="text-green-500 text-sm mb-4 text-center">{message}</div>}
          {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}

          {!isSubmitted && (
            <form className="flex flex-col" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-1.5 mb-4">
                <label htmlFor="email" className="flex align-left font-light text-zinc-400">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-solid border-slate-200 transition-all duration-200 ease-in-out"
                  placeholder="you@example.com"
                />
              </div>

              <button
                type="submit"
                className="p-3.5 w-full text-sm font-light text-white bg-blue-600 rounded-lg transition-all duration-200 ease-in-out hover:bg-blue-700"
              >
                Send Reset Link
              </button>
            </form>
          )}
        </div>
      </main>
    </section>
  );
};

export default ForgotPassword;