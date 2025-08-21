import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Agents() {
  const [agents, setAgents] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', mobile: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('http://localhost:5000/api/agents', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setAgents(res.data));
  }, [success, token]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await axios.post('http://localhost:5000/api/agents', form, { headers: { Authorization: `Bearer ${token}` } });
      setSuccess('Agent added');
      setForm({ name: '', email: '', mobile: '', password: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding agent');
    }
  };

  const deleteAgent = async id => {
    await axios.delete(`http://localhost:5000/api/agents/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    setSuccess('Agent deleted');
  };

  const downloadCSV = () => {
    const csv = ['Name,Email,Mobile', ...agents.map(a => `${a.name},${a.email},${a.mobile}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'agents.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app-container">
      <div className="top-actions">
        <h3>Agents</h3>
        <div>
          <button className="small" onClick={downloadCSV}>Download CSV</button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="mobile" placeholder="Mobile" value={form.mobile} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <button type="submit">Add Agent</button>
      </form>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <table className="agents-table">
        <thead><tr><th>Name</th><th>Email</th><th>Mobile</th><th></th></tr></thead>
        <tbody>
          {agents.map(a => (
            <tr key={a._id}>
              <td>{a.name}</td>
              <td>{a.email}</td>
              <td>{a.mobile}</td>
              <td><button className="small" onClick={() => deleteAgent(a._id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Agents;
