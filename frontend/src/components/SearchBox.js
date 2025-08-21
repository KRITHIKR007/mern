import React from 'react';

export default function SearchBox({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="search-box">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="search-input"
      />
      <div className="search-icon">🔍</div>
    </div>
  );
}
