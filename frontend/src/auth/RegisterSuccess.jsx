import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Logo from '../imag/logo.png'; // Import the Logo component
import './auth.css';
const RegistrationSuccess = () => {
  const [countdown, setCountdown] = useState(3);
  const navigate = useNavigate();

  // Check for existing token on page load
  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      navigate('/home');
    }
  }, [navigate]);

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
    <section>
      <main>
        <div id="whiteBox">
         {/* Header Section */}
                   <header>
                     <img src={Logo} alt="Medical icon" />
                     <h1>MedTrack</h1>
                     <p id="moto">Track your medical analysis with ease!</p>
                   </header>

            <div>
              <h2>
                Your account has been created successfully!
              </h2>
              <p>
                Redirecting to the login page in {countdown}...
              </p>
              <p>
                If the redirection doesn't happen automatically,{' '}
                <a href="/login">
                  click here
                </a>.
              </p>
            </div>
        </div>
      </main>
    </section>
  );
};

export default RegistrationSuccess;
