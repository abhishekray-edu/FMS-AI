import React, { useState } from 'react';
import type { Booking } from '../types';

interface SearchBookingsProps {
  onSearchByName: (name: string) => void;
  onSearchByRange: (startId: number, endId: number) => void;
  searchResults: Booking[];
  isLoading: boolean;
}

const SearchBookings: React.FC<SearchBookingsProps> = ({
  onSearchByName,
  onSearchByRange,
  searchResults,
  isLoading,
}) => {
  const [searchName, setSearchName] = useState('');
  const [startId, setStartId] = useState('');
  const [endId, setEndId] = useState('');

  const handleNameSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchName.trim()) {
      onSearchByName(searchName.trim());
    }
  };

  const handleRangeSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const start = parseInt(startId);
    const end = parseInt(endId);
    
    if (!isNaN(start) && !isNaN(end)) {
      onSearchByRange(start, end);
    } else {
      alert('Please enter valid ID numbers');
    }
  };

  const clearResults = () => {
    setSearchName('');
    setStartId('');
    setEndId('');
    // Clear results by searching with empty parameters
    onSearchByName('');
  };

  return (
    <div className="card">
      <h3>Search Bookings</h3>
      
      <div className="search-section">
        {/* Search by Name */}
        <div>
          <h4>Search by Passenger Name</h4>
          <form onSubmit={handleNameSearch}>
            <div className="form-group">
              <input
                type="text"
                className="form-input"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Enter passenger name"
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={!searchName.trim()}>
              Search by Name
            </button>
          </form>
        </div>

        {/* Search by ID Range */}
        <div>
          <h4>Search by ID Range</h4>
          <form onSubmit={handleRangeSearch}>
            <div className="form-group">
              <input
                type="number"
                className="form-input"
                value={startId}
                onChange={(e) => setStartId(e.target.value)}
                placeholder="Start ID"
                style={{ marginBottom: '0.5rem' }}
              />
              <input
                type="number"
                className="form-input"
                value={endId}
                onChange={(e) => setEndId(e.target.value)}
                placeholder="End ID"
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={!startId || !endId}
            >
              Search by Range
            </button>
          </form>
        </div>
      </div>

      {/* Clear Results */}
      {searchResults.length > 0 && (
        <button className="btn btn-secondary" onClick={clearResults}>
          Clear Results
        </button>
      )}

      {/* Search Results */}
      <div className="search-results">
        {isLoading ? (
          <div className="loading">Searching...</div>
        ) : searchResults.length > 0 ? (
          <div>
            <h4>Search Results ({searchResults.length})</h4>
            <table className="booking-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Passenger Name</th>
                  <th>Seat</th>
                </tr>
              </thead>
              <tbody>
                {searchResults.map((booking) => (
                  <tr key={booking.id}>
                    <td>{booking.id}</td>
                    <td>{booking.name}</td>
                    <td>{booking.seat}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : searchResults.length === 0 && (searchName || startId || endId) ? (
          <p style={{ textAlign: 'center', color: '#666', padding: '1rem' }}>
            No bookings found matching your search criteria.
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default SearchBookings; 