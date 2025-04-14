import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, matchPath  } from 'react-router-dom';
import './App.css'
import Login from './auth/Login';
import Register from './auth/Register';
import ForgotPassword from './auth/ForgotPassword';
import ResetPassword from './auth/ResetPassword';
import HomePage from './HomePage';
import RegistrationSuccess from './auth/RegisterSuccess';
import Header from './components/Header';

const Layout = ({ children }) => {
  const location = useLocation();
  const hideHeaderRoutes = ['/login', '/register', '/forgot-password', '/reset-password/:token', '/register-success'];

  const shouldHideHeader = hideHeaderRoutes.some((route) =>
    matchPath({ path: route, end: true }, location.pathname)
  );
  return (
    <>
      {!shouldHideHeader && <Header />}
      {children}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <Layout>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />\
        <Route path="/register-success" element={<RegistrationSuccess />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/home" element={<HomePage />} />
        {/* Add other routes here */}
      </Routes>
      </Layout> 
    </Router> 
  );
};

export default App;
