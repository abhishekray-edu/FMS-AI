import React, { useState, useEffect } from 'react';
import type { Booking, BookingCreate, BookingUpdate, SeatMap } from './types';
import { ApiService } from './components/ApiService';
import SeatMapComponent from './components/SeatMap';
import BookingForm from './components/BookingForm';
import BookingTable from './components/BookingTable';
import SearchBookings from './components/SearchBookings';

const App: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [seatMap, setSeatMap] = useState<SeatMap | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'book' | 'view' | 'search'>('book');

  // Load initial data
  useEffect(() => {
    loadBookings();
    loadSeatMap();
  }, []);

  const loadBookings = async () => {
    try {
      setIsLoading(true);
      const data = await ApiService.getAllBookings();
      setBookings(data);
    } catch (err) {
      setError('Failed to load bookings');
      console.error('Error loading bookings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSeatMap = async () => {
    try {
      const data = await ApiService.getSeatMap();
      setSeatMap(data);
    } catch (err) {
      setError('Failed to load seat map');
      console.error('Error loading seat map:', err);
    }
  };

  const handleCreateBooking = async (bookingData: BookingCreate) => {
    try {
      setIsLoading(true);
      setError(null);
      const newBooking = await ApiService.createBooking(bookingData);
      setBookings([...bookings, newBooking]);
      setSelectedSeat(null);
      setSuccess('Booking created successfully!');
      await loadSeatMap(); // Refresh seat map
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create booking');
      console.error('Error creating booking:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateBooking = async (id: number, bookingData: BookingUpdate) => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedBooking = await ApiService.updateBooking(id, bookingData);
      setBookings(bookings.map(b => b.id === id ? updatedBooking : b));
      setSuccess('Booking updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update booking');
      console.error('Error updating booking:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBooking = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await ApiService.deleteBooking(id);
      setBookings(bookings.filter(b => b.id !== id));
      setSuccess('Booking deleted successfully!');
      await loadSeatMap(); // Refresh seat map
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to delete booking');
      console.error('Error deleting booking:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAllBookings = async () => {
    if (!window.confirm('Are you sure you want to delete ALL bookings? This action cannot be undone.')) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await ApiService.deleteAllBookings();
      setBookings([]);
      setSearchResults([]);
      setSuccess('All bookings deleted successfully!');
      await loadSeatMap(); // Refresh seat map
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to delete all bookings');
      console.error('Error deleting all bookings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchByName = async (name: string) => {
    if (!name.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const results = await ApiService.searchBookingsByName(name);
      setSearchResults(results);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to search bookings');
      console.error('Error searching bookings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchByRange = async (startId: number, endId: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const results = await ApiService.getBookingsInRange(startId, endId);
      setSearchResults(results);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to search bookings');
      console.error('Error searching bookings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeatClick = (seatCode: string) => {
    setSelectedSeat(selectedSeat === seatCode ? null : seatCode);
  };

  return (
    <div className="app-container">
      {/* Header */}
      <div className="app-header">
        <h1 className="app-title"> FMS-AI</h1>
        <p className="app-subtitle">AI-powered web-based flight booking with interactive seat management</p>
      </div>

      {/* Error and Success Messages */}
      {error && (
        <div className="error">
          {error}
          <button 
            onClick={() => setError(null)} 
            style={{ float: 'right', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
          >
            ×
          </button>
        </div>
      )}

      {success && (
        <div className="success">
          {success}
          <button 
            onClick={() => setSuccess(null)} 
            style={{ float: 'right', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
          >
            ×
          </button>
        </div>
      )}

      {/* Three Card Layout */}
      <div className="three-card-layout">
        {/* Left Card - Seat Map */}
        <div className="card seat-map-card">
          {seatMap && (
            <SeatMapComponent
              seatMap={seatMap}
              selectedSeat={selectedSeat}
              onSeatClick={handleSeatClick}
            />
          )}
        </div>

        {/* Middle Card - Menu & Content */}
        <div className="card menu-card">
          <div className="menu-header">
            <h3> Booking Management</h3>
            <p>Manage your flight bookings</p>
          </div>

          {/* Menu Buttons */}
          <div className="menu-buttons">
            <button
              className={`menu-button ${activeSection === 'book' ? 'active' : ''}`}
              onClick={() => setActiveSection('book')}
            >
               Book Flight
            </button>
            <button
              className={`menu-button ${activeSection === 'view' ? 'active' : ''}`}
              onClick={() => setActiveSection('view')}
            >
               View Bookings
            </button>
            <button
              className={`menu-button ${activeSection === 'search' ? 'active' : ''}`}
              onClick={() => setActiveSection('search')}
            >
               Search Bookings
            </button>
          </div>

          {/* Content Area */}
          <div className="content-area">
            {activeSection === 'book' && (
              <BookingForm
                selectedSeat={selectedSeat}
                onSubmit={handleCreateBooking}
                isLoading={isLoading}
              />
            )}

            {activeSection === 'view' && (
              <BookingTable
                bookings={bookings}
                onUpdateBooking={handleUpdateBooking}
                onDeleteBooking={handleDeleteBooking}
                onDeleteAllBookings={handleDeleteAllBookings}
                isLoading={isLoading}
              />
            )}

            {activeSection === 'search' && (
              <SearchBookings
                onSearchByName={handleSearchByName}
                onSearchByRange={handleSearchByRange}
                searchResults={searchResults}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>

        {/* Right Card - Chatbot */}
        <div className="card chatbot-card">
          <div className="chatbot-header">
            <h3> Flight Assistant</h3>
            <p>Ask me anything about your booking</p>
          </div>
          
          <div className="chat-container">
            <div className="chat-messages">
              <div className="message bot-message">
                <div className="message-avatar">🤖</div>
                <div className="message-content">
                  <div className="message-text">
                    Hello! I'm your flight booking assistant. How can I help you today?
                  </div>
                  <div className="message-time">Just now</div>
                </div>
              </div>
              
              <div className="message user-message">
                <div className="message-content">
                  <div className="message-text">
                    How do I select a seat?
                  </div>
                  <div className="message-time">Just now</div>
                </div>
                <div className="message-avatar">👤</div>
              </div>
              
              <div className="message bot-message">
                <div className="message-avatar">🤖</div>
                <div className="message-content">
                  <div className="message-text">
                    Simply click on any available seat (green) in the seat map. The seat will be highlighted and automatically filled in the booking form.
                  </div>
                  <div className="message-time">Just now</div>
                </div>
              </div>
            </div>
            
            <div className="chat-input-container">
              <input
                type="text"
                className="chat-input"
                placeholder="Type your message..."
                disabled
              />
              <button className="chat-send-btn" disabled>
                ➤
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App; 