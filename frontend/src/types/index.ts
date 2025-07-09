export interface Booking {
  id: number;
  name: string;
  seat: string;
}

export interface BookingCreate {
  name: string;
  seat: string;
}

export interface BookingUpdate {
  name: string;
}

export interface SeatStatus {
  seat_code: string;
  is_booked: boolean;
}

export interface SeatMap {
  rows: number;
  columns: number;
  seat_labels: string[];
  seat_status: SeatStatus[][];
}

export interface AvailableSeats {
  available_seats: string[];
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
} 