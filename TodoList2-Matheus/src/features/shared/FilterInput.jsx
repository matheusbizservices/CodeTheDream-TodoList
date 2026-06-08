import React from 'react';

export default function FilterInput({ filterTerm, onFilterChange }) {
  return (
    <div className="filter-input-container" style={{ marginBottom: '16px' }}>
      <label htmlFor="filterInput">Search todos: </label>
      <input
        id="filterInput"
        type="text"
        value={filterTerm}
        onChange={(e) => onFilterChange(e.target.value)}
        placeholder="Search by title..."
      />
    </div>
  );
}