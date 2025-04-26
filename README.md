[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

# Flight Booking System

## Authors
Abhishek Ray, Krish Karki, Arjun Pun Magar, Saquib Mahmood

## Overview
This project is a console-based flight booking system developed by our team using C++17 compiler. In this project, we used a DSA concept of self-balancing AVL tree to store and manage flight bookings (ID, passenger name, seat) and a 2D array to track seat availability. 
All CRUD operations (add, search, update, delete) and display functions (in-order, by range, by name) are available for user to interact with using the menu dispayed each time an operation is performed. Above menu, seating arrangement of flight is also visualized. A cross mark represent that the seat is already booked. 

## Prerequisites
- A C++17-compliant compiler (example: `g++`)
- `make` (to run the Makefile)
- Standard library only (external dependencies not required)

## Build
```bash
make
```

## Run
```bash
./booking_system
```
Switch to full screen for terminal window to visualize seats in the flight and access menu at the same time.

Follow the on-screen menu and input number from 1-9 based on operation:
1. Add Booking  
2. Search by ID  
3. Update Booking  
4. Delete Booking  
5. Display All Bookings  
6. Search by Name  
7. Display ID Range  
8. Delete All  
9. Exit

## Repository
https://github.com/abhishekray-edu/flight-booking-system

## Documentation
- [Design Document](docs/DESIGN.md)
- [Test Plan](docs/TESTS.md)

## License
This project is released under the MIT License.  
See the [LICENSE](LICENSE) file for full details.