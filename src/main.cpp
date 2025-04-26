// This is the Main.cpp file of the Flight booking system.

// We have made the following changes from our previous prototype:
// 1. We have made the root private in order to prevent free access to a class' data and ultimately preserving Object Oriented design
// 2. We have added two new functions called displaySeats and getSeatPosition
// 3. We use above mentioned function in order to display the seat layout everytime before
//    displaying the menu again
// 4. We have made our program more structured with more descriptive comments throughout the
//    entire code base

// These are the necessary header files which allow us to perform actions
// like input/output, string handling, output manipulations and so on.
#include <iostream>
#include "AVLTree.h"
#include <limits> // For clearing bad input
#include <iomanip>
#include <string>
#include <map>

// This spares us from having to use std:: for several times.
using namespace std;

// Here we are defining constants for the airplane seating layout
const int ROWS = 20; // This is the total number of rows(20) in the airplane
const int COLS = 4;  // These are the number of seats per row ( A , B , C , D )
bool seatMap[ROWS][COLS] = {false}; // This is a 2D array to keep track of the booked seats(true means booked so initially kept at false)
char seatLabels[4] = {'A', 'B', 'C', 'D'}; // seats label that are displayed at the top of the columns of seats

// this is displaySeats function that display airplane seat layout
void displaySeats() {
    cout << "\n         A   B     C   D" << endl;
    cout << "        ------------------" << endl;
    
    for (int i = 0; i < ROWS; i++) {
        // here we are formatting the row numbers with leading zero such as 01, 02 and so on
        cout << "  " << setw(2) << setfill('0') << i + 1 << "    ";
        // display each seat in the row where X represents a booked seat and blank represents an unboooked one
        for (int j = 0; j < COLS; j++) {
            if (j == 2) cout << "  ";// this is to represent the gap between the seats in the left and the ones in the right side
            cout << "[" << (seatMap[i][j] ? 'X' : ' ') << "] ";
        }
        
        cout << "   " << endl;
    }
    
    cout << "        ------------------" << endl;
    cout << "         ";
}

// getSeatPosition is a helper function that converts seat code (e.g., 5C) to row and column indices
bool getSeatPosition(const string& seatCode, int& row, int& col) {
    
    if (seatCode.length() < 2) return false;// if the codes are too short they are rejected
    
    try {
        row = stoi(seatCode.substr(0, seatCode.length() - 1)) - 1;//numeric part is extracted to be row index
        
        col = toupper(seatCode.back()) - 'A';// last character is made upper case and then made column index
        
        return row >= 0 && row < ROWS && col >= 0 && col < COLS;// this is to make sure that both row and column fall within valid bounds
    }
    catch (...) {
        return false;// we do this inorder to handle any non-numeric or invalid format input
    }
}

// this is the main function. It is the entry point of the program. It has the necessary program logic to handle user input, display the
// option menu and perform the respective booking operations as desired by the user
int main() {
    
    AVLTree tree; // here we instantiate the AVL tree in order to manage the booking records
    int choice, id; // declaring the choice and id variable to accept user input for the option they want and the id associated with it
    string name, seatCode;// declaring the name and seatCode variable to accept user input for name and the seat they want
    char confirm;// this variable is user in several occasions in order to confirm before deletion or exit
    
    while (true) {
        // here we call the displaySeats() method to show the user the available
        // seat layout before each operation
        
        displaySeats();
        
        // this is the diplay menu of our Flight booking system with all of the available options
        // that correspond to the available action you as a user can perform using this system
        // of ours
        
        cout << "\n---FLIGHT BOOKING SYSTEM---\n" << endl;

        cout << "1. Add Booking" <<endl;
        cout << "2. Search Booking by ID" << endl;
        cout << "3. Update Booking" << endl;
        cout << "4. Delete Booking" << endl;
        cout << "5. Display All Bookings" << endl;
        cout << "6. Search Booking by Name" << endl;
        cout << "7. Display Bookings in ID Range" << endl;
        cout << "8. Delete all Bookings" << endl;
        cout << "9. Exit" << endl;

        // here we are asking the user to make a choice between the available options
        cout << "Choose any operation from 1 to 9: ";

        cin >> choice;

        // this if statement handles invalid choice input from the user such as non-numeric input
        if (cin.fail()) {
            cout << "Please enter a number corresponding to the above choices." << endl;
            cin.clear();
            cin.ignore(numeric_limits<streamsize>::max(), '\n');
            continue;
        }

        // we handle the choice input from the user using switch-case statements
        switch (choice) {
            case 1: { // allows new booking
                cout << "Please enter the booking ID: ";
                cin >> id;
                if (cin.fail() || id < 0) {
                    cout << "Please enter a valid positive number." << endl;
                    cin.clear();
                    cin.ignore(numeric_limits<streamsize>::max(), '\n');
                    continue;
                }
                
                if (tree.search(id)) {
                    cout << "That booking ID already exists. Duplicate IDs are not allowed." << endl;
                    break;
                }

                cout << "Please enter Passenger Name: ";
                cin.ignore(); // allows to consume newline left by the previous cin statement
                getline(cin, name);
                
                cout << "Enter seat to book (e.g., 5C): ";
                cin >> seatCode;

                int row, col;
                
                if (!getSeatPosition(seatCode, row, col)) {
                    cout << "Invalid seat code." << endl;
                    break;
                }

                // Check if seat is already booked in seat map
                if (seatMap[row][col]) {
                    cout << "That seat is already booked." << endl;
                    break;
                }

                // Check if seat is already assigned in the AVL tree (safety against duplication
                // of seat codes)
                bool seatTaken = false;
                
                for (int testId = 1; testId <= 9999; ++testId) {
                    
                    Booking* b = tree.search(testId);
                    
                    if (b && b->seat == seatCode) {
                        seatTaken = true;
                        break;
                    }
                }
                if (seatTaken) {
                    cout << "This seat is already assigned to someone." << endl ;
                    break;
                }

                // if the seat entered is valid and is available then the booking is inserted
                // the AVL tree
                Booking b = {id, name, seatCode};
                tree.insert(b);
                seatMap[row][col] = true; // here we are marking the seat as booked

                cout << "Booking has been added and seat " << seatCode << " is assigned to " << name << "." << endl ;
                break;
            }

            case 2: { // allows to Search Booking by ID number
                cout << "Please enter the booking ID number you want to search: ";
                cin >> id;
                
                Booking* result = tree.search(id);
                
                if (result)
                    cout << "Found: ID " << result->id << ", Name: " << result->name << ", Seat: " << result->seat << endl;
                else
                    cout << "Booking not found." << endl ;
                break;
            }

            case 3: { // allow to Update Booking
                cout << "Please enter booking ID to update the name of passenger: ";
                cin >> id;
                
                Booking* result = tree.search(id);
                
                if (!result) {
                    cout << "Booking not found." << endl ;
                    break;
                }
                
                cout << "Please enter a new passenger name: ";
                cin.ignore();
                getline(cin, name);
                result->name = name;
                cout << "Name has been updated successfully." << endl ;
                break;
            }

            case 4: { // Allows to Delete Booking
                cout << "Please enter booking ID you want to delete: ";
                cin >> id;
                
                string seatRemoved;

                    bool deleted = tree.deleteBooking(id, seatRemoved);
                    if (deleted) {
                        int row, col;
                        if (getSeatPosition(seatRemoved, row, col)) {
                            seatMap[row][col] = false; // here we free the seat
                        }
    
                        cout << "Booking has been deleted and seat " << seatRemoved << " is now available.\n";
                    }
                else {
                    cout << "Booking ID not found." << endl ;
                }
                break;
            }

            case 5: { // Allows to Display All Bookings
                cout << "The bookings so far are as follows:" << endl;
                tree.displayInOrder();
                break;
                
            }

            case 6: { // Allows to Search Booking by Name
                cout << "Please enter the passenger's name you want to search in the database: ";
                cin.ignore(); // allows to consume newline left by the previous cin statement
                getline(cin, name);
                tree.searchByName(name);
                break;
                
            }

            case 7: { // Allows to Display Bookings in a particular ID Range
                int startId, endId;
                cout << "Please enter the start ID: ";
                cin >> startId;
                if (cin.fail() || startId < 0) {
                    cout << "Please enter a valid positive number." << endl;
                    cin.clear();
                    cin.ignore(numeric_limits<streamsize>::max(), '\n');
                    continue;
                }
                cout << "Please enter the end ID: ";
                cin >> endId;
                if (cin.fail() || endId < 0) {
                    cout << "Please enter a valid positive number." << endl;
                    cin.clear();
                    cin.ignore(numeric_limits<streamsize>::max(), '\n');
                    continue;
                }
                tree.displayRange(startId, endId);
                break;
                
            }

            case 8: { // Allows to delete all the bookings created so far
                
                char confirm;
                cout << "Are you sure you want to delete ALL bookings? (y/n): ";
                cin >> confirm;
                
                if (confirm == 'y' || confirm == 'Y') {
                    tree.clear();// here we clear all the AVL nodes
                    
                    for (int i = 0; i < ROWS; ++i)
                        
                        for (int j = 0; j < COLS; ++j)
                            seatMap[i][j] = false;// we are resetting the seat map
                    cout << "All bookings have been deleted and the seat map has been reset." << endl;
                }
                else {
                    cout << "Deletion has been cancelled as per your wish." << endl;
                }
                break;
                
            }

            case 9: { // Allows to Exit the program execution
                cout << "Are you sure that you want to exit? (y/n): ";
                cin >> confirm;
                if (confirm == 'y' || confirm == 'Y') {
                    cout << "Exiting now..." << endl;
                    return 0;
                } else {
                    cout << "Returning to the main menu..." << endl;
                }
                break;
            }

            default:
                
                cout << "Invalid option." << endl;
        }
    }

    return 0;
}

