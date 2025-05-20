import React from 'react';
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, matchPath  } from 'react-router-dom';
import './index.css'
import Login from './auth/Login';
import Register from './auth/Register';
import ForgotPassword from './auth/ForgotPassword';
import ResetPassword from './auth/ResetPassword';
import HomePage from './mainPages/HomePage';
import RegistrationSuccess from './auth/RegisterSuccess';
import Header from './components/Header';
import LandingPage from './LandingPage';
import UploadAnalysis from './mainPages/UploadAnalysis';
import Nothing from './components/Nothing';
import ManualEntry from './mainPages/ManualEntry';


const Layout = ({ children }) => {
  const location = useLocation();

useEffect(() => {
  const root = document.getElementById('root');
  const isHome = location.pathname === '/home';
  const hasClass = root.classList.contains('home-root');

  if (isHome && !hasClass) {
    root.classList.add('home-root');
  } else if (!isHome && hasClass) {
    root.classList.remove('home-root');
  }
}, [location]);


  const hideHeaderRoutes = ['/login', '/register', '/forgot-password', '/reset-password/:token', '/register-success','/'];

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
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />\
        <Route path="/register-success" element={<RegistrationSuccess />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/upload-analysis" element={<UploadAnalysis />} />
        <Route path="/nothing" element={<Nothing />} />
        <Route path="/manual-entry" element={<ManualEntry />} />
        {/* Add other routes here */}
      </Routes>
      </Layout> 
    </Router> 
  );
};

export default App;
