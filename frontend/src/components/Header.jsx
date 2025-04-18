import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css'; // Import the CSS file
import Logo from '../imag/logo.png'; // Import the logo image

const Header = () => {
  const navigate = useNavigate();
  const [first_name, setFirst_name] = useState('');

  useEffect(() => {
    // Check both localStorage and sessionStorage
    const storedFirst_name = localStorage.getItem('first_name') || sessionStorage.getItem('first_name');
    
    if (storedFirst_name) {
      setFirst_name(storedFirst_name);
    }
  },[]);

  return (
    <header className="headerBAR">
      {/* Left Section */}
      <div className="container left-container">
        <img src={Logo} alt="Medical icon"/>
        <button className="home-button" onClick={() => navigate('/home')}>Home</button>
      </div>

      {/* Right Section */}
      <div className="container right-container">
        <span>Hello, {first_name}!</span>
      </div>
    </header>
  );
};

export default Header;