import React, { useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useTheme } from './contexts/ThemeContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './ProtectedRoute';
import './style.css';

function App() {
  const { isDark } = useTheme();

  useEffect(() => {
    // Apply theme to both html and body elements
    const theme = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    
    // Add debug class for CSS loading verification
    document.body.classList.add('mern-app-loaded');
  }, [isDark]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
  <Route path="/dashboard/*" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
