import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

export default function Header() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const logout = () => { localStorage.removeItem('token'); navigate('/login'); };
  
  return (
    <header className="site-header">
      <div className="brand">MERN Agent Pro</div>
      <nav className="site-nav">
        <Link to="/dashboard/agents" className="hover-lift">Agents</Link>
        <Link to="/dashboard/upload" className="hover-lift">Upload Lists</Link>
        <Link to="/dashboard/lists" className="hover-lift">View Lists</Link>
      </nav>
      <div className="site-actions">
        <button 
          className="theme-toggle tooltip" 
          onClick={toggleTheme}
          data-tooltip={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme"
        >
          {isDark ? '☀️' : '🌙'}
        </button>
        <button className="btn-danger btn-small" onClick={logout}>Logout</button>
      </div>
    </header>
  );
}
