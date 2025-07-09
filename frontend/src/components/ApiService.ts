import axios from 'axios';
import type { Booking, BookingCreate, BookingUpdate, SeatMap, AvailableSeats } from '../types';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export class ApiService {
  // Booking endpoints
  static async getAllBookings(): Promise<Booking[]> {
    const response = await api.get('/bookings');
    return response.data;
  }

  static async getBooking(id: number): Promise<Booking> {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  }

  static async createBooking(booking: BookingCreate): Promise<Booking> {
    const response = await api.post('/bookings', booking);
    return response.data;
  }

  static async updateBooking(id: number, booking: BookingUpdate): Promise<Booking> {
    const response = await api.put(`/bookings/${id}`, booking);
    return response.data;
  }

  static async deleteBooking(id: number): Promise<void> {
    await api.delete(`/bookings/${id}`);
  }

  static async deleteAllBookings(): Promise<void> {
    await api.delete('/bookings');
  }

  // Search endpoints
  static async searchBookingsByName(name: string): Promise<Booking[]> {
    const response = await api.get(`/bookings/search/name/${encodeURIComponent(name)}`);
    return response.data;
  }

  static async getBookingsInRange(startId: number, endId: number): Promise<Booking[]> {
    const response = await api.get(`/bookings/range/${startId}/${endId}`);
    return response.data;
  }

  // Seat endpoints
  static async getSeatMap(): Promise<SeatMap> {
    const response = await api.get('/seats');
    return response.data;
  }

  static async getAvailableSeats(): Promise<AvailableSeats> {
    const response = await api.get('/seats/available');
    return response.data;
  }
} 