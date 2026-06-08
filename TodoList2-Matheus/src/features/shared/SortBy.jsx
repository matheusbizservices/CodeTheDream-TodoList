import React from 'react';

export default function SortBy({
  sortBy,
  sortDirection,
  onSortByChange,
  onSortDirectionChange
}) {
  return (
    <div className="sort-by-container" style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
      <div>
        <label htmlFor="sortBySelect">Sort by: </label>
        <select
          id="sortBySelect"
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
        >
          <option value="creationDate">Creation Date</option>
          <option value="title">Title</option>
        </select>
      </div>

      <div>
        <label htmlFor="sortDirectionSelect">Order: </label>
        <select
          id="sortDirectionSelect"
          value={sortDirection}
          onChange={(e) => onSortDirectionChange(e.target.value)}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>
    </div>
  );
}