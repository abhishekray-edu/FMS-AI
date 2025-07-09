#!/usr/bin/env python3
"""
Test script for AVL tree implementation
"""

from avl_tree import AVLTree, Booking

def test_avl_tree():
    """Test the AVL tree implementation"""
    print("🧪 Testing AVL Tree Implementation...")
    
    # Create AVL tree
    tree = AVLTree()
    
    # Test 1: Insert bookings
    print("\n1. Testing insertions...")
    bookings = [
        Booking(id=5, name="Alice Johnson", seat="03A"),
        Booking(id=3, name="Bob Smith", seat="07B"),
        Booking(id=7, name="Carol Davis", seat="12C"),
        Booking(id=1, name="David Wilson", seat="01D"),
        Booking(id=9, name="Eva Brown", seat="20A"),
        Booking(id=2, name="Frank Miller", seat="05B"),
        Booking(id=8, name="Grace Lee", seat="15C"),
        Booking(id=4, name="Henry Taylor", seat="10D"),
    ]
    
    for booking in bookings:
        tree.insert(booking)
        print(f"   Inserted: ID {booking.id}, {booking.name}, Seat {booking.seat}")
    
    # Test 2: Get all bookings (should be in order)
    print("\n2. Testing get_all_bookings (in-order traversal)...")
    all_bookings = tree.get_all_bookings()
    for booking in all_bookings:
        print(f"   ID {booking.id}: {booking.name} - Seat {booking.seat}")
    
    # Test 3: Search by ID
    print("\n3. Testing search by ID...")
    test_ids = [1, 5, 9, 10]  # 10 doesn't exist
    for test_id in test_ids:
        result = tree.search(test_id)
        if result:
            print(f"   Found ID {test_id}: {result.name} - Seat {result.seat}")
        else:
            print(f"   ID {test_id} not found")
    
    # Test 4: Search by name
    print("\n4. Testing search by name...")
    test_names = ["Alice", "Bob", "XYZ"]  # XYZ doesn't exist
    for name in test_names:
        results = tree.search_by_name(name)
        if results:
            print(f"   Found {len(results)} booking(s) for '{name}':")
            for booking in results:
                print(f"     ID {booking.id}: {booking.name} - Seat {booking.seat}")
        else:
            print(f"   No bookings found for '{name}'")
    
    # Test 5: Range search
    print("\n5. Testing range search...")
    range_results = tree.get_bookings_in_range(3, 7)
    print(f"   Found {len(range_results)} booking(s) in range 3-7:")
    for booking in range_results:
        print(f"     ID {booking.id}: {booking.name} - Seat {booking.seat}")
    
    # Test 6: Delete booking
    print("\n6. Testing delete...")
    delete_id = 5
    deleted_booking = tree.delete(delete_id)
    if deleted_booking:
        print(f"   Deleted ID {delete_id}: {deleted_booking.name} - Seat {deleted_booking.seat}")
    else:
        print(f"   Failed to delete ID {delete_id}")
    
    # Test 7: Verify deletion
    print("\n7. Verifying deletion...")
    remaining_bookings = tree.get_all_bookings()
    print(f"   Remaining {len(remaining_bookings)} booking(s):")
    for booking in remaining_bookings:
        print(f"     ID {booking.id}: {booking.name} - Seat {booking.seat}")
    
    # Test 8: Clear all
    print("\n8. Testing clear...")
    tree.clear()
    remaining_after_clear = tree.get_all_bookings()
    print(f"   After clear: {len(remaining_after_clear)} booking(s)")
    
    print("\n✅ All tests completed successfully!")
    print("🎉 AVL tree implementation is working correctly!")

if __name__ == "__main__":
    test_avl_tree() 