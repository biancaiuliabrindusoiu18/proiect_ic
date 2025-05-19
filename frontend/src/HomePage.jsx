import React, { useEffect } from 'react';
import './home.css';
import Logo from './imag/logo.png';
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

    // Check for existing token on page load
    useEffect(() => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        navigate('/login'); // Redirect to login page if no token is found
      }
    }, [navigate]);
  
  return (
    <section className="home-container">
      <header className="home-header">
        <img src={Logo} alt="Logo" className="home-logo" />
        <h1>Welcome to MedTrack</h1>
        <p className="home-subtitle">Your health, organized and accessible.</p>
      </header>

      <main className="home-main">
        <p className="home-text">
          This is your home page. From here, you’ll be able to view and manage your medical analyses.
        </p>
        <button className="logout-button" onClick={() => {
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
          window.location.href = '/login';
        }}>
          Log out
        </button>
      </main>
    </section>
  );
};

export default Home;
