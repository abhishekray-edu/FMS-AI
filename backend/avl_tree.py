from typing import Optional, List
from dataclasses import dataclass

@dataclass
class Booking:
    id: int
    name: str
    seat: str

class AVLNode:
    def __init__(self, booking: Booking):
        self.booking = booking
        self.left: Optional[AVLNode] = None
        self.right: Optional[AVLNode] = None
        self.height = 1

class AVLTree:
    def __init__(self):
        self.root: Optional[AVLNode] = None
    
    def _height(self, node: Optional[AVLNode]) -> int:
        """Get height of a node"""
        if node is None:
            return 0
        return node.height
    
    def _balance_factor(self, node: Optional[AVLNode]) -> int:
        """Get balance factor of a node"""
        if node is None:
            return 0
        return self._height(node.left) - self._height(node.right)
    
    def _update_height(self, node: Optional[AVLNode]):
        """Update height of a node"""
        if node is not None:
            node.height = max(self._height(node.left), self._height(node.right)) + 1
    
    def _rotate_right(self, y: AVLNode) -> AVLNode:
        """Right rotation"""
        x = y.left
        T2 = x.right
        
        x.right = y
        y.left = T2
        
        self._update_height(y)
        self._update_height(x)
        
        return x
    
    def _rotate_left(self, x: AVLNode) -> AVLNode:
        """Left rotation"""
        y = x.right
        T2 = y.left
        
        y.left = x
        x.right = T2
        
        self._update_height(x)
        self._update_height(y)
        
        return y
    
    def _balance(self, node: AVLNode) -> AVLNode:
        """Balance the AVL tree"""
        self._update_height(node)
        
        balance = self._balance_factor(node)
        
        # Left Left Case
        if balance > 1 and self._balance_factor(node.left) >= 0:
            return self._rotate_right(node)
        
        # Right Right Case
        if balance < -1 and self._balance_factor(node.right) <= 0:
            return self._rotate_left(node)
        
        # Left Right Case
        if balance > 1 and self._balance_factor(node.left) < 0:
            node.left = self._rotate_left(node.left)
            return self._rotate_right(node)
        
        # Right Left Case
        if balance < -1 and self._balance_factor(node.right) > 0:
            node.right = self._rotate_right(node.right)
            return self._rotate_left(node)
        
        return node
    
    def _insert_recursive(self, node: Optional[AVLNode], booking: Booking) -> AVLNode:
        """Recursively insert a booking into the AVL tree"""
        if node is None:
            return AVLNode(booking)
        
        if booking.id < node.booking.id:
            node.left = self._insert_recursive(node.left, booking)
        elif booking.id > node.booking.id:
            node.right = self._insert_recursive(node.right, booking)
        else:
            # Duplicate ID - update the booking
            node.booking = booking
            return node
        
        return self._balance(node)
    
    def insert(self, booking: Booking):
        """Insert a booking into the AVL tree"""
        self.root = self._insert_recursive(self.root, booking)
    
    def _find_min(self, node: AVLNode) -> AVLNode:
        """Find the node with minimum value in a subtree"""
        current = node
        while current.left is not None:
            current = current.left
        return current
    
    def _delete_recursive(self, node: Optional[AVLNode], booking_id: int) -> Optional[AVLNode]:
        """Recursively delete a booking from the AVL tree"""
        if node is None:
            return None
        
        if booking_id < node.booking.id:
            node.left = self._delete_recursive(node.left, booking_id)
        elif booking_id > node.booking.id:
            node.right = self._delete_recursive(node.right, booking_id)
        else:
            # Node to be deleted found
            
            # Node with only one child or no child
            if node.left is None:
                return node.right
            elif node.right is None:
                return node.left
            
            # Node with two children: Get the inorder successor (smallest in right subtree)
            temp = self._find_min(node.right)
            node.booking = temp.booking
            node.right = self._delete_recursive(node.right, temp.booking.id)
        
        return self._balance(node)
    
    def delete(self, booking_id: int) -> Optional[Booking]:
        """Delete a booking from the AVL tree"""
        # First find the booking to get the seat
        booking = self.search(booking_id)
        if booking is None:
            return None
        
        self.root = self._delete_recursive(self.root, booking_id)
        return booking
    
    def _search_recursive(self, node: Optional[AVLNode], booking_id: int) -> Optional[Booking]:
        """Recursively search for a booking by ID"""
        if node is None or node.booking.id == booking_id:
            return node.booking if node else None
        
        if booking_id < node.booking.id:
            return self._search_recursive(node.left, booking_id)
        return self._search_recursive(node.right, booking_id)
    
    def search(self, booking_id: int) -> Optional[Booking]:
        """Search for a booking by ID"""
        return self._search_recursive(self.root, booking_id)
    
    def _inorder_recursive(self, node: Optional[AVLNode], result: List[Booking]):
        """Recursively perform inorder traversal"""
        if node is not None:
            self._inorder_recursive(node.left, result)
            result.append(node.booking)
            self._inorder_recursive(node.right, result)
    
    def get_all_bookings(self) -> List[Booking]:
        """Get all bookings in order"""
        result = []
        self._inorder_recursive(self.root, result)
        return result
    
    def _search_by_name_recursive(self, node: Optional[AVLNode], name: str, result: List[Booking]):
        """Recursively search for bookings by name"""
        if node is not None:
            self._search_by_name_recursive(node.left, name, result)
            if name.lower() in node.booking.name.lower():
                result.append(node.booking)
            self._search_by_name_recursive(node.right, name, result)
    
    def search_by_name(self, name: str) -> List[Booking]:
        """Search for bookings by name"""
        result = []
        self._search_by_name_recursive(self.root, name, result)
        return result
    
    def _range_search_recursive(self, node: Optional[AVLNode], start_id: int, end_id: int, result: List[Booking]):
        """Recursively search for bookings in a range"""
        if node is not None:
            if start_id < node.booking.id:
                self._range_search_recursive(node.left, start_id, end_id, result)
            if start_id <= node.booking.id <= end_id:
                result.append(node.booking)
            if end_id > node.booking.id:
                self._range_search_recursive(node.right, start_id, end_id, result)
    
    def get_bookings_in_range(self, start_id: int, end_id: int) -> List[Booking]:
        """Get bookings within an ID range"""
        result = []
        self._range_search_recursive(self.root, start_id, end_id, result)
        return result
    
    def clear(self):
        """Clear all bookings"""
        self.root = None 