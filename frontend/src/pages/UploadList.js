import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../components/Card';

function UploadList() {
  const [file, setFile] = useState(null);
  const [agents, setAgents] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAgents();
  }, [token]);

  const fetchAgents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/agents', { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setAgents(res.data);
    } catch (err) {
      console.error('Failed to fetch agents:', err);
    }
  };

  const handleFileChange = e => {
    setFile(e.target.files[0]);
    setMessage('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    
    if (!file) {
      setMessage('Please select a file');
      setMessageType('error');
      setLoading(false);
      return;
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      await axios.post('http://localhost:5000/api/lists/upload', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage('✅ List uploaded and distributed successfully!');
      setMessageType('success');
      setFile(null);
      document.querySelector('input[type="file"]').value = '';
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || 'Upload failed'}`);
      setMessageType('error');
    }
    setLoading(false);
  };

  return (
    <div className="page-container fade-in">
      <Card 
        title="Upload & Distribute Lists"
        loading={loading}
      >
        <div className="upload-info">
          <h4>Instructions</h4>
          <ul>
            <li>Upload CSV or Excel files (.csv, .xlsx, .xls)</li>
            <li>Lists will be automatically distributed among {agents.length} agents</li>
            <li>Supported formats: Name, Email, Phone, Address columns</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-group">
            <label className="form-label">Select File</label>
            <div className="file-input-wrapper">
              <input 
                type="file" 
                accept=".csv,.xlsx,.xls" 
                onChange={handleFileChange}
                className="file-input"
                id="fileInput"
              />
              <label htmlFor="fileInput" className="file-input-label">
                📁 {file ? file.name : 'Choose File'}
              </label>
            </div>
          </div>
          
          <button type="submit" disabled={loading || !file} className="btn-large btn-success">
            {loading ? '⏳ Uploading...' : '📤 Upload & Distribute'}
          </button>
        </form>
        
        {message && (
          <div className={`alert alert-${messageType}`}>
            {message}
          </div>
        )}
        
        <div className="agents-info">
          <h4>Available Agents ({agents.length})</h4>
          <div className="agent-grid">
            {agents.slice(0, 6).map(agent => (
              <div key={agent._id} className="agent-badge">
                <strong>{agent.name}</strong>
                <span>{agent.email}</span>
              </div>
            ))}
            {agents.length > 6 && (
              <div className="agent-badge more">
                +{agents.length - 6} more
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default UploadList;
