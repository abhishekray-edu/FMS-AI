# Test Plan
Our team tried and ran these unique scenarios in the console to verify every feature works as expected of a flight booking system that we proposed for semester project.

----

### 1. Add Valid Booking
- **Input Sequence:**  
  1. Enter `1` (Add Booking)  
  2. ID: `1001`  
  3. Name: `Abhishek Ray`  
  4. Seat: `05B`  
- **Expected Output:**  
  - “Booking has been added and seat 05B is assigned to Abhishek Ray.”  
  - Seat map shows **05B** marked as booked with cross X sign.  
- **Verifies:**  
  - `insert` logic  
  - Seat‐map synchronization  

----

MAKE 2 MORE RANDOM BOOKINGS IN ORDER TO TEST DISPLAY ALL FUNCTIONALITY LATER.
ID: 1006, Name: Abhiyan Poudel, Seat: 20D
ID: 1007, Name: Sujjal Chapagain, Seat: 19A

----

### 2. Add Duplicate ID
- **Input Sequence:**  
  1. Enter `1`  
  2. ID: `1001` (again)  
  3. Name: `Abhishek Ray`  
  4. Seat: `05C`  
- **Expected Output:**  
  - That booking ID already exists. Duplicate IDs are not allowed. 
  - Seat map remains unchanged; **05C** stays available.  
- **Verifies:**  
  - ID uniqueness check  

----

### 3. Add Invalid Seat
- **Input Sequence:**  
  1. Enter `1`  
  2. ID: `1002`  
  3. Name: `Krish Karki`  
  4. Seat: `21Z`  
- **Expected Output:**  
  - “Invalid seat code.”  
  - Booking not inserted.  
- **Verifies:**  
  - Input validation for seat codes based on available rows and columns 

----

### 4. Search by ID (found)
- **Input Sequence:**  
  1. Enter `2` (Search by ID)  
  2. ID: `1001`  
- **Expected Output:**  
  - “Found: ID 1001, Name: Abhishek Ray, Seat: 05B”  
- **Verifies:**  
  - `search(id)` functionality  

---

### 5. Search by ID (not found)
- **Input Sequence:**  
  1. Enter `2`  
  2. ID: `1005`  
- **Expected Output:**  
  - “Booking not found.”  
- **Verifies:**  
  - Handling of IDs that are not available.  

----

### 6. Search by Name
- **Input Sequence:**  
  1. Enter `6` (Search by Name)  
  2. Name: `Abhishek Ray`  
- **Expected Output:**  
  - List showing “ID 1001, Seat 05B”  
- **Verifies:**  
  - `searchByName` functionality  

----

### 7. Update Name
- **Input Sequence:**  
  1. Enter `3` (Update Booking)  
  2. ID: `1001`  
  3. New Name: `Krish Karki`  
- **Expected Output:**  
  - “Name has been updated successfully.”  
  - Searching ID 1001 now shows “Name: Krish Karki.”  
- **Verifies:**  
  - In‐place update of a booking  

----

### 8. Display In-Order
- **Input Sequence:**  
  1. Enter `5` (Display All Bookings)  
- **Expected Output:**  
  - "All Bookings:
     ID: 1001, Name: Krish Karki, Seat: 05B
     ID: 1006, Name: Abhiyan Poudel, Seat: 20D
     ID: 1007, Name: Sujjal Chapagain, Seat: 19A"
  - A sorted list of all bookings by ID.  

- **Verifies:**  
  - `inOrderTraversal` output  

----

### 9. Display Range
- **Input Sequence:**  
  1. Enter `7` (Display ID Range)  
  2. Start ID: `1001`  
  3. End ID: `1006`  
- **Expected Output:**  
  - "Bookings in Range:
     ID: 1001, Name: Krish Karki, Seat: 05B
     ID: 1006, Name: Abhiyan Poudel, Seat: 20D"
  - Only bookings with **1001 ≤ ID ≤ 1006** are shown.  
- **Verifies:**  
  - `displayRange` filtering  

----

### 10. Delete Booking
- **Input Sequence:**  
  1. Enter `4` (Delete Booking)  
  2. ID: `1007`  
- **Expected Output:**  
  - “Booking has been deleted and seat 19A is now available.”  
  - Seat 19A freed in the seat map.  
- **Verifies:**  
  - `deleteBooking` and seat‐map reset  

----

### 11. Delete All
- **Input Sequence:**  
  1. Enter `8` (Delete all Bookings)  
  2. Confirm: `y`  
- **Expected Output:**  
  - “All bookings have been deleted and the seat map has been reset.”  
  - No bookings remain; all seats made available.  
- **Verifies:**  
  - `clear()` and full seat‐map reset  

----

### 12. Exit
- **Input Sequence:**  
  1. Enter `9` (Exit)  
  2. Confirm: `y`  
- **Expected Output:**  
  - "Exiting now..."
  - Program terminates cleanly.  
- **Verifies:**  
  - Safe shutdown of the application  
