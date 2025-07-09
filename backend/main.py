from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
from datetime import datetime
from avl_tree import AVLTree, Booking

app = FastAPI(title="Flight Booking System API", version="1.0.0")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for API
class BookingCreate(BaseModel):
    name: str
    seat: str

class BookingUpdate(BaseModel):
    name: str

class BookingResponse(BaseModel):
    id: int
    name: str
    seat: str

# Initialize AVL tree and seat map
avl_tree = AVLTree()
seat_map = [[False for _ in range(4)] for _ in range(20)]  # 20 rows, 4 columns (A, B, C, D)
next_booking_id = 1

def get_seat_position(seat_code: str) -> tuple[Optional[int], Optional[int]]:
    """Convert seat code (e.g., 01D, 05C) to row and column indices"""
    if len(seat_code) < 2:
        return None, None
    
    try:
        # Handle both formats: "01D" and "1D"
        # Find the last letter (column)
        for i in range(len(seat_code) - 1, -1, -1):
            if seat_code[i].isalpha():
                row_part = seat_code[:i]
                col_part = seat_code[i]
                break
        else:
            return None, None
        
        row = int(row_part) - 1  # Extract numeric part and convert to 0-based index
        col = ord(col_part.upper()) - ord('A')  # Convert letter to column index
        
        if 0 <= row < 20 and 0 <= col < 4:
            return row, col
        return None, None
    except ValueError:
        return None, None

def is_seat_available(seat_code: str) -> bool:
    """Check if a seat is available"""
    row, col = get_seat_position(seat_code)
    if row is None or col is None:
        return False
    
    # Check if seat is already booked in seat map
    if seat_map[row][col]:
        return False
    
    # Check if seat is already assigned to another booking in AVL tree
    all_bookings = avl_tree.get_all_bookings()
    for booking in all_bookings:
        if booking.seat == seat_code:
            return False
    
    return True

def mark_seat_booked(seat_code: str):
    """Mark a seat as booked"""
    row, col = get_seat_position(seat_code)
    if row is not None and col is not None:
        seat_map[row][col] = True

def mark_seat_available(seat_code: str):
    """Mark a seat as available"""
    row, col = get_seat_position(seat_code)
    if row is not None and col is not None:
        seat_map[row][col] = False

@app.get("/")
async def root():
    return {"message": "Flight Booking System API"}

@app.get("/bookings", response_model=List[BookingResponse])
async def get_all_bookings():
    """Get all bookings"""
    bookings = avl_tree.get_all_bookings()
    return [BookingResponse(id=b.id, name=b.name, seat=b.seat) for b in bookings]

@app.get("/bookings/{booking_id}", response_model=BookingResponse)
async def get_booking(booking_id: int):
    """Get a specific booking by ID"""
    booking = avl_tree.search(booking_id)
    if booking:
        return BookingResponse(id=booking.id, name=booking.name, seat=booking.seat)
    raise HTTPException(status_code=404, detail="Booking not found")

@app.post("/bookings", response_model=BookingResponse)
async def create_booking(booking_data: BookingCreate):
    """Create a new booking"""
    global next_booking_id
    
    # Validate seat code
    row, col = get_seat_position(booking_data.seat)
    if row is None or col is None:
        raise HTTPException(status_code=400, detail="Invalid seat code")
    
    # Check if seat is available
    if not is_seat_available(booking_data.seat):
        raise HTTPException(status_code=400, detail="Seat is already booked")
    
    # Create new booking
    new_booking = Booking(
        id=next_booking_id,
        name=booking_data.name,
        seat=booking_data.seat
    )
    
    avl_tree.insert(new_booking)
    mark_seat_booked(booking_data.seat)
    next_booking_id += 1
    
    return BookingResponse(id=new_booking.id, name=new_booking.name, seat=new_booking.seat)

@app.put("/bookings/{booking_id}", response_model=BookingResponse)
async def update_booking(booking_id: int, booking_data: BookingUpdate):
    """Update a booking's passenger name"""
    booking = avl_tree.search(booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    # Create updated booking
    updated_booking = Booking(
        id=booking_id,
        name=booking_data.name,
        seat=booking.seat
    )
    
    avl_tree.insert(updated_booking)  # This will update the existing booking
    
    return BookingResponse(id=updated_booking.id, name=updated_booking.name, seat=updated_booking.seat)

@app.delete("/bookings/{booking_id}")
async def delete_booking(booking_id: int):
    """Delete a booking"""
    deleted_booking = avl_tree.delete(booking_id)
    if deleted_booking:
        mark_seat_available(deleted_booking.seat)
        return {"message": f"Booking {booking_id} deleted successfully", "seat_freed": deleted_booking.seat}
    raise HTTPException(status_code=404, detail="Booking not found")

@app.get("/bookings/search/name/{name}")
async def search_bookings_by_name(name: str):
    """Search bookings by passenger name"""
    matching_bookings = avl_tree.search_by_name(name)
    return [BookingResponse(id=b.id, name=b.name, seat=b.seat) for b in matching_bookings]

@app.get("/bookings/range/{start_id}/{end_id}")
async def get_bookings_in_range(start_id: int, end_id: int):
    """Get bookings within an ID range"""
    if start_id > end_id:
        start_id, end_id = end_id, start_id
    
    range_bookings = avl_tree.get_bookings_in_range(start_id, end_id)
    return [BookingResponse(id=b.id, name=b.name, seat=b.seat) for b in range_bookings]

@app.delete("/bookings")
async def delete_all_bookings():
    """Delete all bookings"""
    avl_tree.clear()
    # Reset seat map
    for i in range(20):
        for j in range(4):
            seat_map[i][j] = False
    return {"message": "All bookings deleted successfully"}

@app.get("/seats")
async def get_seat_map():
    """Get the current seat map showing which seats are booked"""
    seat_labels = ['A', 'B', 'C', 'D']
    seat_status = []
    
    for row in range(20):
        row_data = []
        for col in range(4):
            seat_code = f"{row + 1:02d}{seat_labels[col]}"
            is_booked = seat_map[row][col]
            row_data.append({
                "seat_code": seat_code,
                "is_booked": is_booked
            })
        seat_status.append(row_data)
    
    return {
        "rows": 20,
        "columns": 4,
        "seat_labels": seat_labels,
        "seat_status": seat_status
    }

@app.get("/seats/available")
async def get_available_seats():
    """Get list of available seats"""
    seat_labels = ['A', 'B', 'C', 'D']
    available_seats = []
    
    for row in range(20):
        for col in range(4):
            seat_code = f"{row + 1:02d}{seat_labels[col]}"
            if not seat_map[row][col]:
                # Double check it's not assigned to any booking
                all_bookings = avl_tree.get_all_bookings()
                is_assigned = any(b.seat == seat_code for b in all_bookings)
                if not is_assigned:
                    available_seats.append(seat_code)
    
    return {"available_seats": available_seats}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 