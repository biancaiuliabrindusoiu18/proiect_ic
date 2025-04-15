import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Logo from '../imag/logo.png'; // Import the Logo component

const RegistrationSuccess = () => {
  const [countdown, setCountdown] = useState(3);
  const navigate = useNavigate();

  // Redirect to the home page
  useEffect(() => {
    // Set the countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer); // Stop the countdown when it reaches 1
          window.location.href = '/login'; // Redirect to the login
        }
        return prev - 1; // Decrease the countdown by 1 every second
      });
    }, 1000); // Update every second

    // Clean up the interval when the component is unmounted
    return () => clearInterval(timer);
  }, [navigate]);

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

            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg text-center">
              <h2 className="text-2xl font-bold text-green-600 mb-6">
                Your account has been created successfully!
              </h2>
              <p className="text-gray-700 mb-4">
                Redirecting to the login page in {countdown}...
              </p>
              <p className="text-sm text-gray-500">
                If the redirection doesn't happen automatically,{' '}
                <a href="/login" className="text-indigo-600 hover:text-indigo-700">
                  click here
                </a>.
              </p>
            </div>
          </header>
        </div>
      </main>
    </section>
  );
};

export default RegistrationSuccess;
