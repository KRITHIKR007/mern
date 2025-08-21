import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../components/Card';

function AgentLists() {
  const [agents, setAgents] = useState([]);
  const [selected, setSelected] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
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

  const handleSelect = async e => {
    const agentId = e.target.value;
    setSelected(agentId);
    setLoading(true);
    
    if (agentId) {
      const agent = agents.find(a => a._id === agentId);
      setSelectedAgent(agent);
      
      try {
        const res = await axios.get(`http://localhost:5000/api/lists/agent/${agentId}`, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        setItems(res.data);
      } catch (err) {
        console.error('Failed to fetch agent lists:', err);
        setItems([]);
      }
    } else {
      setItems([]);
      setSelectedAgent(null);
    }
    setLoading(false);
  };

  const exportAgentList = () => {
    if (!items.length) return;
    
    const csv = [
      'Name,Phone,Email,Address,Notes',
      ...items.map(item => 
        `"${item.firstName || 'N/A'}","${item.phone || 'N/A'}","${item.email || 'N/A'}","${item.address || 'N/A'}","${item.notes || 'N/A'}"`
      )
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedAgent?.name || 'agent'}_list.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page-container fade-in">
      <Card 
        title="Agent Lists & Assignments"
        actions={
          selected && items.length > 0 && (
            <button className="btn-secondary btn-small" onClick={exportAgentList}>
              📥 Export List
            </button>
          )
        }
      >
        <div className="agent-selector">
          <label className="form-label">Select Agent to View Assigned Lists</label>
          <select 
            onChange={handleSelect} 
            value={selected}
            className="agent-select"
          >
            <option value="">Choose an agent...</option>
            {agents.map(a => (
              <option key={a._id} value={a._id}>
                {a.name} ({a.email})
              </option>
            ))}
          </select>
        </div>

        {selectedAgent && (
          <div className="agent-summary">
            <div className="agent-card">
              <div className="agent-info">
                <h4>{selectedAgent.name}</h4>
                <p>{selectedAgent.email}</p>
                <p>{selectedAgent.mobile}</p>
              </div>
              <div className="agent-stats">
                <div className="stat">
                  <span className="stat-number">{items.length}</span>
                  <span className="stat-label">Assigned Items</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading assigned lists...</p>
          </div>
        )}

        {!loading && selected && items.length === 0 && (
          <div className="empty-state">
            <h4>No Lists Assigned</h4>
            <p>This agent doesn't have any assigned lists yet.</p>
          </div>
        )}

        {!loading && items.length > 0 && (
          <div className="items-container">
            <h4>Assigned Lists ({items.length} items)</h4>
            <div className="items-grid">
              {items.map((item, idx) => (
                <div key={idx} className="item-card hover-lift">
                  <div className="item-header">
                    <strong>{item.firstName || 'N/A'}</strong>
                    <span className="item-id">#{idx + 1}</span>
                  </div>
                  <div className="item-details">
                    <div className="detail-row">
                      <span className="detail-label">📞 Phone:</span>
                      <span className="detail-value">{item.phone || 'N/A'}</span>
                    </div>
                    {item.email && (
                      <div className="detail-row">
                        <span className="detail-label">✉️ Email:</span>
                        <span className="detail-value">{item.email}</span>
                      </div>
                    )}
                    {item.address && (
                      <div className="detail-row">
                        <span className="detail-label">📍 Address:</span>
                        <span className="detail-value">{item.address}</span>
                      </div>
                    )}
                    {item.notes && (
                      <div className="detail-row">
                        <span className="detail-label">📝 Notes:</span>
                        <span className="detail-value">{item.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

export default AgentLists;
