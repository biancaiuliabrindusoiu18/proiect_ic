import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Login from './auth/Login';
import Register from './auth/Register';
import ForgotPassword from './auth/ForgotPassword';
import ResetPassword from './auth/ResetPassword';
import HomePage from './HomePage';
import RegistrationSuccess from './auth/RegisterSuccess';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />\
        <Route path="/register-success" element={<RegistrationSuccess />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/home" element={<HomePage />} />
        {/* Add other routes here */}
      </Routes>
    </Router> 
  );
};

export default App;
