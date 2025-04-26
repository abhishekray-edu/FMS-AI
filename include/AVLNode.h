#ifndef AVLNODE_H
#define AVLNODE_H

#include <string>

using namespace std;

// this structure represents each booking in the flight booking system
// and it contains id, a passenger's name, and the seat number of the seat chosen
struct Booking {
    int id;// declaring the id variable
    string name;// declaring the name variable
    string seat;// declaring the seat code variable such as 1A, 2B and so on
};

// this is the node class that represents a single node in the AVL tree
// Each node in stores booking data and then links to its left and right child
class AVLNode {
    
public:
    
    Booking booking; // this contains all the necessary info for this booking
    AVLNode* left; // pointer for the left child node
    AVLNode* right; // pointer for the right child node
    int height; // height variable for the height of the node which is used to calculate
                // balance factor in the AVL tree

    // here the Constructor initializes a node wiht booking data,
    // then sets child pointers to null, and assigns a starting height of 1
    AVLNode(const Booking& b)
        : booking(b), left(nullptr), right(nullptr), height(1) {}
};

#endif
