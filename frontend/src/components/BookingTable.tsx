import React, { useState } from 'react';
import type { Booking, BookingUpdate } from '../types';

interface BookingTableProps {
  bookings: Booking[];
  onUpdateBooking: (id: number, booking: BookingUpdate) => void;
  onDeleteBooking: (id: number) => void;
  onDeleteAllBookings: () => void;
  isLoading: boolean;
}

const BookingTable: React.FC<BookingTableProps> = ({
  bookings,
  onUpdateBooking,
  onDeleteBooking,
  onDeleteAllBookings,
  isLoading,
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');

  const handleEdit = (booking: Booking) => {
    setEditingId(booking.id);
    setEditName(booking.name);
  };

  const handleSave = (id: number) => {
    if (editName.trim()) {
      onUpdateBooking(id, { name: editName.trim() });
      setEditingId(null);
      setEditName('');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditName('');
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="booking-table-container">
      <div className="booking-table-card">
        <div className="booking-table-header">
          <div className="header-content">
            <h3> All Bookings</h3>
            <span className="booking-count">{bookings.length} booking{bookings.length !== 1 ? 's' : ''}</span>
          </div>
          {bookings.length > 0 && (
            <button
              className="btn btn-danger delete-all-btn"
              onClick={onDeleteAllBookings}
            >
              Delete All
            </button>
          )}
        </div>

        {bookings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✈️</div>
            <h4>No Bookings Yet</h4>
            <p>Create your first booking using the booking form!</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="booking-table">
              <thead>
                <tr>
                  <th> ID</th>
                  <th> Passenger Name</th>
                  <th> Seat</th>
                  <th> Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="booking-row">
                    <td className="booking-id">{booking.id}</td>
                    <td className="passenger-name">
                      {editingId === booking.id ? (
                        <input
                          type="text"
                          className="edit-input"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          autoFocus
                        />
                      ) : (
                        <span>{booking.name}</span>
                      )}
                    </td>
                    <td className="seat-code">
                      <span className="seat-badge">{booking.seat}</span>
                    </td>
                    <td className="action-cell">
                      <div className="action-buttons">
                        {editingId === booking.id ? (
                          <>
                            <button
                              className="btn btn-primary save-btn"
                              onClick={() => handleSave(booking.id)}
                            >
                              Save
                            </button>
                            <button
                              className="btn btn-secondary cancel-btn"
                              onClick={handleCancel}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="btn btn-secondary edit-btn"
                              onClick={() => handleEdit(booking)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-danger delete-btn"
                              onClick={() => onDeleteBooking(booking.id)}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingTable; 