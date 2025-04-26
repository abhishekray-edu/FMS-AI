# Design Document

## High-Level Architecture
- **Booking** (`struct`): It holds `id`, `name`, `seat`.

- **AVLNode**: It wraps a `Booking`, two child pointers, and a `height` value.

- **AVLTree**:
  - **Private** `root` pointer.
  - Public methods:
    - `insert(Booking)`, `search(id)`, `deleteBooking(id)`,
    - `displayInOrder()`, `searchByName(name)`, `displayRange(start,end)`, `clear()`.

- **main.cpp**
  - It manages a `bool seatMap[20][4]` for the visual layout.
  - It calls `displaySeats()` before every menu.
  - It validates the user input, keeps `seatMap` in sync with the AVL tree operations.

## AVL Balancing Strategy: 
Our team wanted to guarantee O(log n) operations, even in the worst case scenario. The AVL tree does rotations to stay balanced:

1. **Insertion**: after the recursive insert, update node’s height.
2. Compute **balance factor** = `height(left) – height(right)`.
3. Perform one of four rotations based on balance & insertion key:
   - LL → `rotateRight`
   - RR → `rotateLeft`
   - LR → `rotateLeft(left); rotateRight`
   - RL → `rotateRight(right); rotateLeft`

## Seat-Map Synchronization
- On **Add**: after `tree.insert()`, mark `seatMap[row][col] = true`.

- On **Delete**: `tree.deleteBooking()` returns freed `seat`; convert back to indices and set `false`.

- On **Delete All**: call `tree.clear()`, then reset entire `seatMap` to `false`.
