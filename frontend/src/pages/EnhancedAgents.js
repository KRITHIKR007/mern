import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../components/Card';
import Stats from '../components/Stats';
import SearchBox from '../components/SearchBox';
import Pagination from '../components/Pagination';
import Modal from '../components/Modal';

function EnhancedAgents() {
  const [agents, setAgents] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', mobile: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editAgent, setEditAgent] = useState(null);
  const itemsPerPage = 5;

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAgents();
  }, [success, token]);

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/agents', { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setAgents(res.data);
    } catch (err) {
      setError('Failed to fetch agents');
    }
    setLoading(false);
  };

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(search.toLowerCase()) ||
    agent.email.toLowerCase().includes(search.toLowerCase()) ||
    agent.mobile.includes(search)
  );

  const totalPages = Math.ceil(filteredAgents.length / itemsPerPage);
  const currentAgents = filteredAgents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      if (editAgent) {
        await axios.put(`http://localhost:5000/api/agents/${editAgent._id}`, form, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        setSuccess('Agent updated');
      } else {
        await axios.post('http://localhost:5000/api/agents', form, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        setSuccess('Agent added');
      }
      setForm({ name: '', email: '', mobile: '', password: '' });
      setShowModal(false);
      setEditAgent(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving agent');
    }
    setLoading(false);
  };

  const deleteAgent = async id => {
    if (!window.confirm('Are you sure?')) return;
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/agents/${id}`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setSuccess('Agent deleted');
    } catch (err) {
      setError('Failed to delete agent');
    }
    setLoading(false);
  };

  const editAgentHandler = agent => {
    setEditAgent(agent);
    setForm({ 
      name: agent.name, 
      email: agent.email, 
      mobile: agent.mobile, 
      password: '' 
    });
    setShowModal(true);
  };

  const downloadCSV = () => {
    const csv = ['Name,Email,Mobile', ...filteredAgents.map(a => `${a.name},${a.email},${a.mobile}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'agents.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const stats = [
    { label: 'Total Agents', value: agents.length, change: 12 },
    { label: 'Active', value: agents.length, change: 8 },
    { label: 'This Month', value: Math.floor(agents.length * 0.3), change: 15 }
  ];

  return (
    <div className="page-container fade-in">
      <Stats stats={stats} />
      
      <Card 
        title="Agents Management"
        loading={loading}
        actions={
          <div className="flex gap-md">
            <button className="btn-primary btn-small" onClick={() => setShowModal(true)}>
              <span className="btn-icon">➕ Add Agent</span>
            </button>
            <button className="btn-secondary btn-small" onClick={downloadCSV}>
              <span className="btn-icon">📥 Export CSV</span>
            </button>
          </div>
        }
      >
        <SearchBox 
          value={search} 
          onChange={setSearch} 
          placeholder="Search agents by name, email, or mobile..." 
        />
        
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        
        <div className="table-container">
          <table className="agents-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentAgents.map(a => (
                <tr key={a._id} className="hover-lift">
                  <td><strong>{a.name}</strong></td>
                  <td>{a.email}</td>
                  <td>{a.mobile}</td>
                  <td>
                    <div className="table-actions">
                      <button className="btn-secondary btn-small" onClick={() => editAgentHandler(a)}>
                        ✏️ Edit
                      </button>
                      <button className="btn-danger btn-small" onClick={() => deleteAgent(a._id)}>
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </Card>
      
      {showModal && (
        <Modal 
          title={editAgent ? 'Edit Agent' : 'Add Agent'}
          onClose={() => {setShowModal(false); setEditAgent(null); setForm({ name: '', email: '', mobile: '', password: '' });}}
        >
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input name="name" placeholder="Enter full name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input name="email" type="email" placeholder="Enter email address" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Mobile Number</label>
              <input name="mobile" placeholder="Enter mobile number" value={form.mobile} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input name="password" type="password" placeholder={editAgent ? "New Password (optional)" : "Enter password"} value={form.password} onChange={handleChange} required={!editAgent} />
            </div>
            <button type="submit" disabled={loading} className="btn-large">
              {loading ? '⏳ Saving...' : (editAgent ? '✅ Update Agent' : '➕ Add Agent')}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default EnhancedAgents;
