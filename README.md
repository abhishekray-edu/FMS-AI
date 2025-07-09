# FMS-AI



## Author
Abhishek Ray

## Overview
This is a modern full-stack flight booking system that replicates the functionality of the original C++ console application. The system uses:

- **Backend**: Python FastAPI with AVL tree implementation for fast data access
- **Frontend**: React + TypeScript + Vite for a modern, responsive web interface
- **Data Structure**: Self-balancing AVL tree for O(log n) operations
- **Features**: Interactive seat map, CRUD operations, search functionality, and real-time updates

## Architecture

### Backend (Python FastAPI)
- **AVL Tree Implementation**: Provides O(log n) time complexity for all operations
- **RESTful API**: Complete CRUD operations for bookings
- **Seat Management**: 20 rows × 4 columns (A, B, C, D) seat layout
- **Search Capabilities**: By ID, name, and ID range
- **Real-time Seat Map**: Tracks seat availability

### Frontend (React + TypeScript)
- **Modern UI**: Clean, responsive design with interactive seat map
- **Type Safety**: Full TypeScript implementation
- **Real-time Updates**: Live seat map updates and booking management
- **Search Interface**: Advanced search by name and ID range
- **Error Handling**: Comprehensive error handling and user feedback

## Features

### Core Functionality
1. **Add Booking** - Create new flight bookings with passenger details
2. **Search by ID** - Find specific bookings by booking ID
3. **Update Booking** - Modify passenger names for existing bookings
4. **Delete Booking** - Remove individual bookings
5. **Display All Bookings** - View all current bookings
6. **Search by Name** - Find bookings by passenger name
7. **Display ID Range** - View bookings within a specific ID range
8. **Delete All** - Clear all bookings and reset seat map

### Interactive Features
- **Visual Seat Map**: 20×4 grid showing seat availability
- **Click-to-Select**: Click available seats to auto-fill booking form
- **Real-time Updates**: Seat map updates immediately after bookings
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean, intuitive interface with proper feedback

## Prerequisites

### Backend Requirements
- Python 3.8+
- pip (Python package manager)

### Frontend Requirements
- Node.js 16+
- npm or yarn

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd flight-booking-system
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the backend server
python main.py
```

The backend will be available at `http://localhost:8000`

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 4. Access the Application
Open your browser and navigate to `http://localhost:5173` to access the flight booking system.

## API Endpoints

### Booking Operations
- `GET /bookings` - Get all bookings
- `GET /bookings/{id}` - Get specific booking
- `POST /bookings` - Create new booking
- `PUT /bookings/{id}` - Update booking
- `DELETE /bookings/{id}` - Delete booking
- `DELETE /bookings` - Delete all bookings

### Search Operations
- `GET /bookings/search/name/{name}` - Search by passenger name
- `GET /bookings/range/{start_id}/{end_id}` - Search by ID range

### Seat Operations
- `GET /seats` - Get current seat map
- `GET /seats/available` - Get available seats

## AVL Tree Implementation

The system uses a self-balancing AVL tree for efficient data storage and retrieval:

### Key Features
- **O(log n) Operations**: All insert, search, and delete operations
- **Automatic Balancing**: Maintains tree balance after each operation
- **Four Rotation Types**: LL, RR, LR, RL rotations for proper balancing
- **In-order Traversal**: Efficient retrieval of all bookings in sorted order

### Operations
- `insert(booking)` - Add new booking with automatic balancing
- `search(id)` - Find booking by ID
- `delete(id)` - Remove booking and free seat
- `search_by_name(name)` - Find bookings by passenger name
- `get_bookings_in_range(start, end)` - Get bookings in ID range
- `get_all_bookings()` - Get all bookings in order
- `clear()` - Remove all bookings

## Seat Layout

The flight has a 20×4 seating arrangement:
```
         A   B     C   D
        ------------------
  01    [ ] [ ]  [ ] [ ]
  02    [ ] [ ]  [ ] [ ]
  03    [ ] [ ]  [ ] [ ]
  ...   ... ...  ... ...
  20    [ ] [ ]  [ ] [ ]
        ------------------
```

- **Rows**: 01-20 (20 rows)
- **Columns**: A, B, C, D (4 seats per row)
- **Aisle**: Gap between columns B and C
- **Seat Codes**: Format as "05C" (row 5, seat C)

## Development

### Backend Development
```bash
cd backend
# Activate virtual environment
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Run with auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Development
```bash
cd frontend
npm run dev
```

### Building for Production
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
pip install -r requirements.txt
python main.py
```

## Testing

### Backend Testing
```bash
cd backend
python -m pytest  # If pytest is installed
```

### Frontend Testing
```bash
cd frontend
npm test  # If testing framework is configured
```

## Performance

### Time Complexity
- **Insert**: O(log n)
- **Search**: O(log n)
- **Delete**: O(log n)
- **Range Search**: O(log n + k) where k is number of results
- **Name Search**: O(n) - requires full tree traversal

### Space Complexity
- **Storage**: O(n) for n bookings
- **Auxiliary**: O(log n) for recursion stack

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is released under the MIT License.  
See the [LICENSE](LICENSE) file for full details.

## Repository
https://github.com/abhishekray-edu/flight-booking-system

## Documentation
- [Design Document](docs/DESIGN.md)
- [Test Plan](docs/TESTS.md)