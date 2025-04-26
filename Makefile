CXX       := g++
CXXFLAGS  := -std=c++17 -Iinclude -Wall -Wextra
SRC       := src/main.cpp src/AVLTree.cpp
OBJ       := $(SRC:src/%.cpp=build/%.o)
TARGET    := booking_system

all: $(TARGET)

$(TARGET): $(OBJ)
	$(CXX) $(CXXFLAGS) -o $@ $^

build/%.o: src/%.cpp
	mkdir -p build
	$(CXX) $(CXXFLAGS) -c $< -o $@

clean:
	rm -rf build $(TARGET)
