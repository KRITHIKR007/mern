import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Agents from './Agents';
import EnhancedAgents from './EnhancedAgents';
import UploadList from './UploadList';
import AgentLists from './AgentLists';
import Header from '../components/Header';

function Dashboard() {
  return (
    <>
      <Header />
      <div className="app-container">
        <div className="dashboard-welcome">
          <h2>Welcome to Agent Management System</h2>
          <p>Manage your agents, upload lists, and track assignments efficiently.</p>
        </div>
        <Routes>
          <Route path="agents" element={<EnhancedAgents />} />
          <Route path="upload" element={<UploadList />} />
          <Route path="lists" element={<AgentLists />} />
        </Routes>
      </div>
    </>
  );
}

export default Dashboard;
