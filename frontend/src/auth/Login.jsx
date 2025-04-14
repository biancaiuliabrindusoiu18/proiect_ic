import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import Logo from '../imag/logo.png'; // Import the Logo component

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false); // Remember me checkbox state
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  
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
        rememberMe: rememberMe // Send the rememberMe state
      });

      // If everything is okay
      console.log('Login successful:', response.data);
      setError('');

      // Redirect to the home page
      useEffect(() => {
        // Set the countdown
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev === 1) {
              clearInterval(timer); // Stop the countdown when it reaches 1
              window.location.href ='/home'; // Redirect to the home page
            }
            return prev - 1; // Decrease the countdown by 1 every second
          });
        }, 1000); // Update every second
    
        // Clean up the interval when the component is unmounted
        return () => clearInterval(timer);
      }, [navigate]);

    } catch (err) {
      console.error(err);
      if (err.response?.data?.msg) {
        setError(err.response.data.msg);
      } else {
        setError('An error occurred during login.');
      }
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
      <p id="moto" className="text-sm font-light text-center text-gray-400 max-sm:text-xs">
        Track your medical analysis with ease!
      </p>
    </header>
    
  <nav className="flex justify-center">    {/* tailwind not working? */}
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

    <form className="flex flex-col" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="flex align-left font-light text-zinc-400">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-solid transition-all border-slate-200 duration-[0.2s] ease-[ease]"
          placeholder="email@example.com"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="flex align-left font-light text-zinc-400">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-solid transition-all border-slate-200 duration-[0.2s] ease-[ease]"
          placeholder="********"
        />
      </div>

      <div className="flex justify-between items-center mx-0 my-2.5">
        <div className="flex gap-1.5 items-center text-sm font-semibold text-zinc-400">
          <label htmlFor="rememberMe" className="text-sm text-gray-700">
            Stay logged in
          </label>
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)} // Toggle the checkbox state
            className="mr-2"
          />
        </div>
        <div className="mt-4 text-center text-sm">
          <a href="/forgot-password" className="text-indigo-600 hover:text-indigo-700">
            Forgot password?
          </a>
        </div>
      </div>

      <button
        type="submit"
        className="p-3.5 w-full text-sm font-light text-white bg-blue-600 rounded-lg transition-all cursor-pointer border-[none] duration-[0.2s] ease-[ease] hover:bg-blue-700"
      >
        Enter your account!
      </button>
    </form>
    </div>
  </main>
</section>

  );
};

export default Login;
