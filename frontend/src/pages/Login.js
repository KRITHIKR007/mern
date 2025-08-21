import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
  localStorage.setItem('token', res.data.token);
  // set axios default header for subsequent requests
  axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
  navigate('/dashboard');
    } catch (err) {
  setError(err.response?.data?.message || err.message || 'Login failed');
    }
  };

  return (
    <>
      <div className="site-header">
        <div className="brand">MERN Agent Pro</div>
        <button 
          onClick={toggleTheme}
          className="theme-toggle tooltip"
          data-tooltip={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme"
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>
      <div className="app-container slide-up">
        <div className="text-center">
          <h2>Admin Login</h2>
          <p style={{marginBottom:'var(--spacing-lg)',color:'var(--text-secondary)'}}>
            Use <span className="badge badge-primary">admin@example.com</span> with password <span className="badge badge-primary">Admin@123</span> to login.
            <br/>After login, you can manage agents, upload lists, and view assignments.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="fade-in">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-with-icon">
              <span className="input-icon">📧</span>
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-with-icon">
              <span className="input-icon">🔒</span>
              <input 
                type="password" 
                placeholder="Enter your password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
              />
            </div>
          </div>
          <button type="submit" className="btn-large">Sign In</button>
        </form>
        {error && <div className="alert alert-error">{error}</div>}
      </div>
    </>
  );
}

export default Login;
