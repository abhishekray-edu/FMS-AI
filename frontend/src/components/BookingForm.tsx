import React, { useState } from 'react';
import type { BookingCreate } from '../types';

interface BookingFormProps {
  selectedSeat: string | null;
  onSubmit: (booking: BookingCreate) => void;
  isLoading: boolean;
}

const BookingForm: React.FC<BookingFormProps> = ({ selectedSeat, onSubmit, isLoading }) => {
  const [passengerName, setPassengerName] = useState('');
  const [seatCode, setSeatCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passengerName.trim()) {
      alert('Please enter a passenger name');
      return;
    }

    const finalSeat = selectedSeat || seatCode;
    if (!finalSeat) {
      alert('Please select a seat or enter a seat code');
      return;
    }

    onSubmit({
      name: passengerName.trim(),
      seat: finalSeat,
    });

    // Reset form
    setPassengerName('');
    setSeatCode('');
  };

  return (
    <div className="booking-form-container">
      <div className="booking-form-card">
        <div className="booking-form-header">
          <h3> Create New Booking</h3>
          <p>Fill in the details below to create a new flight booking</p>
        </div>
        
        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-group">
            <label htmlFor="passengerName" className="form-label">
               Passenger Name
            </label>
            <input
              type="text"
              id="passengerName"
              className="form-input"
              value={passengerName}
              onChange={(e) => setPassengerName(e.target.value)}
              placeholder="Enter passenger full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="seatCode" className="form-label">
               Seat Code (optional if seat selected from map)
            </label>
            <input
              type="text"
              id="seatCode"
              className="form-input"
              value={seatCode}
              onChange={(e) => setSeatCode(e.target.value.toUpperCase())}
              placeholder="e.g., 05A, 12C"
              disabled={!!selectedSeat}
            />
          </div>

          {selectedSeat && (
            <div className="selected-seat-display">
              <label className="form-label"> Selected Seat</label>
              <div className="selected-seat-box">
                <span className="seat-icon"></span>
                <span className="seat-code">{selectedSeat}</span>
              </div>
            </div>
          )}

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary booking-submit-btn"
              disabled={isLoading || (!passengerName.trim() && !selectedSeat && !seatCode)}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Creating Booking...
                </>
              ) : (
                <>
                  <span className="btn-icon"></span>
                  Create Booking
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm; 