#!/usr/bin/env python3
"""
Test script for the complete Flight Booking System
"""

import requests
import time
import json

def test_backend():
    """Test the backend API"""
    print("🧪 Testing Backend API...")
    
    base_url = "http://localhost:8000"
    
    try:
        # Test 1: Root endpoint
        print("1. Testing root endpoint...")
        response = requests.get(f"{base_url}/")
        if response.status_code == 200:
            print("   ✅ Backend is running")
        else:
            print("   ❌ Backend is not responding")
            return False
        
        # Test 2: Get seat map
        print("2. Testing seat map endpoint...")
        response = requests.get(f"{base_url}/seats")
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Seat map loaded: {data['rows']} rows × {data['columns']} columns")
        else:
            print("   ❌ Failed to get seat map")
            return False
        
        # Test 3: Create a booking
        print("3. Testing booking creation...")
        booking_data = {
            "name": "Test Passenger",
            "seat": "10B"
        }
        response = requests.post(f"{base_url}/bookings", json=booking_data)
        if response.status_code == 200:
            booking = response.json()
            print(f"   ✅ Booking created: ID {booking['id']}, {booking['name']}, Seat {booking['seat']}")
            booking_id = booking['id']
        else:
            print(f"   ❌ Failed to create booking: {response.text}")
            return False
        
        # Test 4: Get all bookings
        print("4. Testing get all bookings...")
        response = requests.get(f"{base_url}/bookings")
        if response.status_code == 200:
            bookings = response.json()
            print(f"   ✅ Found {len(bookings)} booking(s)")
        else:
            print("   ❌ Failed to get bookings")
            return False
        
        # Test 5: Search by name
        print("5. Testing search by name...")
        response = requests.get(f"{base_url}/bookings/search/name/Test")
        if response.status_code == 200:
            results = response.json()
            print(f"   ✅ Found {len(results)} booking(s) for 'Test'")
        else:
            print("   ❌ Failed to search by name")
            return False
        
        # Test 6: Update booking
        print("6. Testing booking update...")
        update_data = {"name": "Updated Test Passenger"}
        response = requests.put(f"{base_url}/bookings/{booking_id}", json=update_data)
        if response.status_code == 200:
            updated_booking = response.json()
            print(f"   ✅ Booking updated: {updated_booking['name']}")
        else:
            print("   ❌ Failed to update booking")
            return False
        
        # Test 7: Delete booking
        print("7. Testing booking deletion...")
        response = requests.delete(f"{base_url}/bookings/{booking_id}")
        if response.status_code == 200:
            print("   ✅ Booking deleted successfully")
        else:
            print("   ❌ Failed to delete booking")
            return False
        
        print("\n✅ Backend API tests completed successfully!")
        return True
        
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend. Make sure it's running on http://localhost:8000")
        return False
    except Exception as e:
        print(f"❌ Error testing backend: {e}")
        return False

def test_frontend():
    """Test the frontend"""
    print("\n🧪 Testing Frontend...")
    
    try:
        # Test if frontend is accessible
        response = requests.get("http://localhost:5173/", timeout=5)
        if response.status_code == 200:
            print("   ✅ Frontend is accessible")
            return True
        else:
            print(f"   ❌ Frontend returned status code: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("   ❌ Cannot connect to frontend. Make sure it's running on http://localhost:5173")
        return False
    except requests.exceptions.Timeout:
        print("   ❌ Frontend connection timeout")
        return False
    except Exception as e:
        print(f"   ❌ Error testing frontend: {e}")
        return False

def main():
    """Main test function"""
    print("🚀 Flight Booking System - Complete System Test")
    print("=" * 50)
    
    # Test backend
    backend_ok = test_backend()
    
    # Test frontend
    frontend_ok = test_frontend()
    
    print("\n" + "=" * 50)
    print("📊 Test Results:")
    print(f"   Backend: {'✅ PASS' if backend_ok else '❌ FAIL'}")
    print(f"   Frontend: {'✅ PASS' if frontend_ok else '❌ FAIL'}")
    
    if backend_ok and frontend_ok:
        print("\n🎉 All tests passed! The system is working correctly.")
        print("\n🌐 Access your application:")
        print("   Frontend: http://localhost:5173")
        print("   Backend API: http://localhost:8000")
        print("   API Documentation: http://localhost:8000/docs")
    else:
        print("\n⚠️  Some tests failed. Please check the logs above.")
        
        if not backend_ok:
            print("\n🔧 To start the backend:")
            print("   cd backend")
            print("   source venv/bin/activate  # or venv\\Scripts\\activate on Windows")
            print("   python main.py")
            
        if not frontend_ok:
            print("\n🔧 To start the frontend:")
            print("   cd frontend")
            print("   npm run dev")

if __name__ == "__main__":
    main() 