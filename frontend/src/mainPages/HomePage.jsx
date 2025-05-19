import React, { useEffect, useState } from 'react';
import './HomePage.css';
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
  
  // Handle visualizing tests
  const handleVisualizeTests = () => {
    navigate('/visualize'); // Navigate to visualization page
  };

  // Handle adding new test results
  const handleAddTest = () => {
    navigate('/upload-analysis'); // Navigate to upload analysis page
  };

  // Handle viewing complete history
  const handleViewHistory = () => {
    navigate('/history'); // Navigate to history page
  };
  
  return (
    <div className="home-page">

      
      <div className="home-container">
        
        <div className="section">
          <h2>Quick Actions</h2>
          <div className="actions-container">
            <button className="action-button secondary" onClick={handleVisualizeTests}>
              Visualise tests
            </button>
            
            <button className="action-button primary" onClick={handleAddTest}>
              <span className="plus-icon">+</span>
              Add new test results
            </button>
          </div>
        </div>
        
        <div className="section">
          <h2>Recent Tests</h2>

        </div>
        
        <div className="history-section">
          <button className="history-button" onClick={handleViewHistory}>
            Vezi istoric complet
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;