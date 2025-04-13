import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("First Name:", firstName);
    console.log("Last Name:", lastName);
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Confirm Password:", confirmPassword);
  

    // Check if all the fields are filled
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    } 
      //Check if passwords match
    else if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
          //Send data to the backend for registration
        const response = await axios.post('http://localhost:5000/api/auth/register', {
        account: email,
        password,
        firstName,
        lastName,
      });

      console.log('Registration successful:', response.data);
      setError('');

      useEffect(() => {
        // Set the countdown
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev === 1) {
              clearInterval(timer); // Stop the countdown when it reaches 1
              window.location.href ='/register-success'; // Redirect to the success page
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
        setError(err.response.data.msg); // Backend error message
      } else {
        setError('There was an error during registration.');
      }
    }
  };
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Register</h2>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Example: Elon"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Example: Musk"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
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
          <div className="mb-4 relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password{" "}
              <span className="text-red-500 cursor-pointer ml-4" title="At least 8 characters, 1 letter, 1 number">
                *!
              </span>
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="********"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
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
            Register
          </button>
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <a href="/login" className="text-indigo-600 hover:text-indigo-700">
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;