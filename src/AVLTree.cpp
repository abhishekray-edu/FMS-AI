#include "AVLTree.h"
#include <algorithm> // for allowing std::max

using namespace std;

// this returns the height of the given node
int AVLTree::getHeight(AVLNode* node) {
    if (node == nullptr)
        return 0;
    return node->height;
}
// this returns the balance factor of the given node
int AVLTree::getBalance(AVLNode* node) {
    
    if (node == nullptr)
        return 0;
    return getHeight(node->left) - getHeight(node->right);
}
// this performs a right rotation and then returns the new root
AVLNode* AVLTree::rotateRight(AVLNode* y) {

    AVLNode* x = y->left;
    AVLNode* T2 = x->right;

    x->right = y;
    y->left = T2;

    // here we update heights
    y->height = max(getHeight(y->left), getHeight(y->right)) + 1;
    x->height = max(getHeight(x->left), getHeight(x->right)) + 1;

    return x;
}
// this performs a left rotation and returns the new root
AVLNode* AVLTree::rotateLeft(AVLNode* x) {
    AVLNode* y = x->right;
    AVLNode* T2 = y->left;

    y->left = x;
    x->right = T2;

    // here we update heights
    x->height = max(getHeight(x->left), getHeight(x->right)) + 1;
    y->height = max(getHeight(y->left), getHeight(y->right)) + 1;

    return y;
}

// this find the node with the minimum value
AVLNode* AVLTree::minValueNode(AVLNode* node) {
    AVLNode* current = node;
    while (current->left != nullptr)
        current = current->left;
    return current;
}

// here we insert a new booking into the AVL tree and balance it
AVLNode* AVLTree::insert(AVLNode* node, const Booking& booking) {
    
    if (node == nullptr)
        return new AVLNode(booking);
    
    if (booking.id < node->booking.id)
        node->left = insert(node->left, booking);
    else if (booking.id > node->booking.id)
        node->right = insert(node->right, booking);
    else
        return node; // duplicate ID not allowed

    // update height
    node->height = max(getHeight(node->left), getHeight(node->right)) + 1;

    // get the balance factor
    int balance = getBalance(node);

    // for left left case
    if (balance > 1 && booking.id < node->left->booking.id)
        return rotateRight(node);
    
    // for right right case
    if (balance < -1 && booking.id > node->right->booking.id)
        return rotateLeft(node);
    
    // for left right case
    if (balance > 1 && booking.id > node->left->booking.id) {
        node->left = rotateLeft(node->left);
        return rotateRight(node);
    }
    
    // and finally for right left case
    if (balance < -1 && booking.id < node->right->booking.id) {
        node->right = rotateRight(node->right);
        return rotateLeft(node);
    }

    return node;
}

// this is a public method to insert a booking
void AVLTree::insert(const Booking& booking) {
    root = insert(root, booking);
}

// here a booking with the given id is recursively searched for
AVLNode* AVLTree::search(AVLNode* node, int id) {
    
    if (node == nullptr || node->booking.id == id)
        return node;
    if (id < node->booking.id)
        return search(node->left, id);
    return search(node->right, id);
}

// this is a public method to search for a booking by id
Booking* AVLTree::search(int id) {
    AVLNode* found = search(root, id);
    return found ? &found->booking : nullptr;
}
// here this deletes a node withe a particular id and rebalances the tree
AVLNode* AVLTree::deleteNode(AVLNode* node, int id, bool& deleted, string& seatOut) {
    
    if (node == nullptr)
        return node;

    if (id < node->booking.id) {
        node->left = deleteNode(node->left, id, deleted, seatOut);
    }
    else if (id > node->booking.id) {
        node->right = deleteNode(node->right, id, deleted, seatOut);
    }
    else {
        // This is the node to be deleted
        deleted = true;
        seatOut = node->booking.seat;

        // for node with one child or no child
        if (!node->left || !node->right) {
            AVLNode* temp = node->left ? node->left : node->right;
            delete node;
            return temp;
        }

        // Get in-order successor for node with two children(smallest in right subtree)
        AVLNode* temp = minValueNode(node->right);

        // Copy successor data to this node
        node->booking = temp->booking;

        //we delete the successor and capture its seat if we’re actually deleting it
        bool tempDeleted = false;
        string ignoredSeat;
        node->right = deleteNode(node->right, temp->booking.id, tempDeleted, ignoredSeat);
        // But we already set seatOut to the original node’s seat
    }

    // Update height and balance
//    if (!node) return node;

    if (node == nullptr)
        return node;

    node->height = max(getHeight(node->left), getHeight(node->right)) + 1;
    int balance = getBalance(node);

    // here the tree is balanced using appropriate rotations
    if (balance > 1 && getBalance(node->left) >= 0)
        return rotateRight(node);
    
    if (balance < -1 && getBalance(node->right) <= 0)
        return rotateLeft(node);
    
    if (balance > 1 && getBalance(node->left) < 0) {
        node->left = rotateLeft(node->left);
        return rotateRight(node);
    }
    
    if (balance < -1 && getBalance(node->right) > 0) {
        node->right = rotateRight(node->right);
        return rotateLeft(node);
    }

    return node;
}
// this is a public method to delete a booking
bool AVLTree::deleteBooking(int id, string& seatOut) {
    bool deleted = false;
    root = deleteNode(root, id, deleted, seatOut);
    return deleted;
}
// inorder transversal to print all bookings
void AVLTree::inOrderTraversal(AVLNode* node) {

    if (node == nullptr)
        return;
    
    inOrderTraversal(node->left);
    cout << "ID: " << node->booking.id
              << ", Name: " << node->booking.name
              << ", Seat: " << node->booking.seat << endl;
    inOrderTraversal(node->right);
}
// public method to display all bookings
void AVLTree::displayInOrder() {
    cout << "\nAll Bookings:\n";
    inOrderTraversal(root);
}

// this is a helper to recursively search for bookings by name
void AVLTree::searchByName(AVLNode* node, const string& name) {

    if (node == nullptr)
        return;
    
    searchByName(node->left, name);
    if (node->booking.name == name){
        cout << "ID: " << node->booking.id << ", Seat: " << node->booking.seat << endl;
    }
    searchByName(node->right, name);
}

// this however is a public method to search bookings by name
void AVLTree::searchByName(const string& name) {
    cout << "\nSearch Results:\n";
    searchByName(root, name);
}

// here this is a helper to recursively display bookings within a given id range
void AVLTree::displayRange(AVLNode* node, int startId, int endId) {

    if (node == nullptr){
        return;
    }
    
    if (node->booking.id > startId){
        displayRange(node->left, startId, endId);
    }
    
    if (node->booking.id >= startId && node->booking.id <= endId){
        cout << "ID: " << node->booking.id
        << ", Name: " << node->booking.name
        << ", Seat: " << node->booking.seat << std::endl;
    }
    
    if (node->booking.id < endId){
        displayRange(node->right, startId, endId);
    }
}
// now here is a public method to display bookings within a range
void AVLTree::displayRange(int startId, int endId) {
    cout << "\nBookings in Range:\n";
    displayRange(root, startId, endId);
}

void AVLTree::destroyTree(AVLNode* node) {

    if (node != nullptr){
        destroyTree(node->left);
        destroyTree(node->right);
        delete node;
    }

}
// this is simply a destructor to free memory
AVLTree::~AVLTree() {
    destroyTree(root);// now all nodes in the tree are cleaned up
}

// the tree is now cleared and the root is reset to nullptr
void AVLTree::clear() {
    destroyTree(root);
    root = nullptr;
}

