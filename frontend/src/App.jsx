import React from 'react';
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, matchPath, useNavigate } from 'react-router-dom';
import './index.css'
import Login from './auth/Login';
import Register from './auth/Register';
import ForgotPassword from './auth/ForgotPassword';
import ResetPassword from './auth/ResetPassword';
import HomePage from './mainPages/HomePage';
import RegistrationSuccess from './auth/RegisterSuccess';
import Header from './components/Header';
import LandingPage from './LandingPage';
import UploadAnalyses from './mainPages/UploadAnalyses';
import Nothing from './components/Nothing';
import ManualEntry from './mainPages/UploadPages/ManualEntry';
import VerifyData from './mainPages/UploadPages/VerifyData';
import { jwtDecode } from 'jwt-decode';
import AllAnalyses from './mainPages/VisualizePages/AllAnalyses';

import AnalysisDetails from './mainPages/VisualizePages/AnalysesDetails';

const noTokenRoute = ['/login', '/register', '/forgot-password', '/reset-password/:token', '/register-success','/'];

const checkTokenValidity = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;
    return decoded.exp && decoded.exp > now;
  } catch (err) {
    return false;
  }
};

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

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

useEffect(() => {
    const isPublic = noTokenRoute.some((route) => matchPath({ path: route, end: true }, location.pathname));
    const isTokenValid = checkTokenValidity();

    if (!isPublic && !isTokenValid) {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      navigate('/login');
    }
    else if (isPublic && isTokenValid) {
      navigate('/home');
    }
  }, [location, navigate]);


  
  const shouldHideHeader = noTokenRoute.some((route) =>
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
        <Route path="/upload-analyses" element={<UploadAnalyses />} />
        <Route path="/nothing" element={<Nothing />} />
        <Route path="/manual-entry" element={<ManualEntry />} />
        <Route path="/verify-analyses" element={<VerifyData />} />
        <Route path="/all-analyses" element={<AllAnalyses />} />
        <Route path="/analyses/:testName" element={<AnalysisDetails />} />
        {/* Add other routes here */}
      </Routes>
      </Layout> 
    </Router> 
  );
};

export default App;
