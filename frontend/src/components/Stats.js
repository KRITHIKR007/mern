import React from 'react';

export default function Stats({ stats }) {
  return (
    <div className="stats-grid">
      {stats.map((stat, idx) => (
        <div key={idx} className="stat-card">
          <div className="stat-value">{stat.value}</div>
          <div className="stat-label">{stat.label}</div>
          {stat.change && (
            <div className={`stat-change ${stat.change > 0 ? 'positive' : 'negative'}`}>
              {stat.change > 0 ? '↗' : '↘'} {Math.abs(stat.change)}%
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
