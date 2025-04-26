#ifndef AVLTREE_H
#define AVLTREE_H

#include "AVLNode.h"
#include <string>
#include <iostream>
#include <vector>

// here the AVLTree class manages a self-balancing binary search tree
// which is particularly designed to store and manipulate the booking record of
// the flight booking system efficiently.
class AVLTree {
public:
    // this constructor intitializes the tree with a null root
    AVLTree() : root(nullptr) {}
    
    // this is simply a destructor that will eventually release all allocated memory in the tree
    ~AVLTree();
    
    // this here is a public interface to insert a new booking into the AVL tree
    void insert(const Booking& booking);
    
    // this here is another public interface but this time to search for a booking by its id
    // this returns a pointer to the booking in case it finds it or simply points to nullptr
    Booking* search(int id);
    
    // this here deletes a booking by id and returns the seat that was then freed are deletion
    // it returns true if the deletion was successful
    bool deleteBooking(int id, std::string& seatOut);
    
    //here we display bookings in sorted order by ID
    void displayInOrder(); // Display all bookings
    
    // here bookings are search for and then displayed depending on the given name
    void searchByName(const std::string& name);
    
    // here all bookings with ids within a given range are displayed
    void displayRange(int startId, int endId);
    
    // here we wreck havoc and display the entire AVL tree and let the memory be free
    void clear();


private:
    AVLNode* root; // here we have made the root pointer private; following the instruction provided by our professor

    // simply to return the height of a given node
    int getHeight(AVLNode* node);
    
    // here this computes and returns the balance factor of a node
    int getBalance(AVLNode* node);
    
    // here we do right rotation and left rotation around the given node to balance the tree
    AVLNode* rotateRight(AVLNode* y);
    AVLNode* rotateLeft(AVLNode* x);
    
    // this is a recursive method to insert a booking into the tree
    // and return the new root after balancing
    AVLNode* insert(AVLNode* node, const Booking& booking);
    
    // another recursive method. this searches for a booking by ID
    AVLNode* search(AVLNode* node, int id);
    
    // this finds the node with the smallest ID in the subtree rooted at the given node
    AVLNode* minValueNode(AVLNode* node);
    
    // this deletes a node by ID
    // this then updates the deletion flag and seatOut reference if the deletion was successful
    AVLNode* deleteNode(AVLNode* node, int id, bool& deleted, std::string& seatOut);
    
    
    // this method helps for inorder transversal to display bookings in sorted order
    void inOrderTraversal(AVLNode* node);
    
    // recursive method to simply search by name and print all the matching bookings
    void searchByName(AVLNode* node, const std::string& name);
    
    // recursive method to simply display all the bookings within a given ID range
    void displayRange(AVLNode* node, int startId, int endId);
    
    void destroyTree(AVLNode* node); // declaration of the helper function to recursivesly
    // destroy the tree and free memory
};

#endif

