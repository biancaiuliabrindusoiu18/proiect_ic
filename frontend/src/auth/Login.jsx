import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false); // Remember me checkbox state

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
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Example: user@example.com"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="********"
            />
            {/* Remember me checkbox */}
            <div className="flex items-center mb-4">
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
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 focus:outline-none"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center text-sm">
          <a href="/forgot-password" className="text-indigo-600 hover:text-indigo-700">
            Forgot password?
          </a>
        </div>
        <div className="mt-2 text-center text-sm">
          Don’t have an account?{' '}
          <a href="/register" className="text-indigo-600 hover:text-indigo-700">
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
