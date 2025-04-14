import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import Logo from '../imag/logo.png';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    } else if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        account: email,
        password,
        firstName,
        lastName,
      });

      console.log('Registration successful:', response.data);
      setError('');

      window.location.href = '/register-success';
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
    <section className="flex justify-center items-center p-5 min-h-screen bg-gray-100">
      <main className="p-10 w-full bg-white rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.05)] 
                      max-w-[800px] mx-auto flex flex-col justify-center min-h-[80vh] min-w-[60vh]">
        <div className="max-w-[90%] mx-auto">

          {/* Header Section */}
          <header className="flex flex-col items-center mb-5">
            <img src={Logo} alt="Medical icon" className="mb-2.5 w-3.5 h-3" />
            <h1 className="mb-1.5 text-2xl text-gray-500 max-sm:text-xl">MedTrack</h1>
            <p id="moto" className="text-sm font-light text-center text-gray-400 max-sm:text-xs">
              Track your medical analysis with ease!
            </p>
          </header>

          <nav className="flex justify-center mb-4">
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

          {error && (
            <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
          )}

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="firstName" className="flex align-left font-light text-zinc-400">First Name</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded-lg border border-solid border-slate-200 transition-all duration-200 ease-in-out"
                placeholder="Example: Elon"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="lastName" className="flex align-left font-light text-zinc-400">Last Name</label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className=" w-full rounded-lg border border-solid border-slate-200 transition-all duration-200 ease-in-out"
                placeholder="Example: Musk"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="flex align-left font-light text-zinc-400">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-solid border-slate-200 transition-all duration-200 ease-in-out"
                placeholder="email@example.com"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="flex align-left font-light text-zinc-400">
                Password
                <span className="text-red-500 cursor-pointer ml-2" id="passwordHint" title="At least 8 characters, 1 letter, 1 number">
                  *!
                </span>
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-solid border-slate-200 transition-all duration-200 ease-in-out"
                placeholder="********"
              />
            </div>

            <div className="flex flex-col gap-1.5 mb-4">
              <label htmlFor="confirmPassword" className="flex align-left font-light text-zinc-400">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-solid border-slate-200 transition-all duration-200 ease-in-out"
                placeholder="********"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 focus:outline-none"
            >
              Register
            </button>
          </form>
        </div>
      </main>
    </section>
  );
};

export default Register;
