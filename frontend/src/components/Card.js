import React from 'react';

export default function Card({ title, children, actions, loading = false }) {
  return (
    <div className="card">
      {loading && <div className="loading-bar"></div>}
      <div className="card-header">
        <h4>{title}</h4>
        {actions && <div className="card-actions">{actions}</div>}
      </div>
      <div className="card-body">{children}</div>
    </div>
  );
}
