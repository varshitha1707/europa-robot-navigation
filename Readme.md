# NASA Europa Robot Navigation Module (Part 1)

This module simulates the movement of robots exploring Europa's surface on a grid, based on provided commands.

## Problem Breakdown
Each robot can:
- Rotate left (L) or right (R) 90 degrees.
- Move forward (M) one step in its current direction.

A robot’s position is represented by:
- `x`, `y` coordinates.
- A direction (`N`, `E`, `S`, `W`).

## Input Format
- The first line: two integers representing the upper-right coordinates of the plateau
  (lower-left is assumed to be `0 0`).
- Each robot gets two lines:
  1. Initial position in the form `x y orientation`.
  2. A string of commands (`L`, `R`, `M`).

### Sample Input
```
5 5 
1 2 N 
LMLMLMLMM 
3 3 E 
MMRMMRMRRM
```


## Output Format
The final position of each robot is printed as `x y orientation`.

### Expected Output
```
1 3 N 
5 1 E
```

## Assumptions
- Robots will not move outside the plateau’s boundaries.
- Robots execute their commands sequentially - robots will only move one after the other, not together.
- Input is always valid and correctly formatted.

## Edge Cases
- **Moving out of bounds**: Robots will not move beyond the grid, if an initial position is given to be out of bounds, it will snap to the grid's bounds.
- **Empty commands**: Robots remain in their initial position.
- **Invalid commands**: If formatted properly, will be caught and an error will be thrown.

### Sample Edge Case Input
```
3 3 
0 0 S 
MMM 
0 0 W 
MMM 
3 3 E 
RRRRMM
```

### Expected Output:
```
0 0 S
0 0 W 
3 3 E
```

## Code Breakdown
1. **`Plateau` Class**: Represents the grid and ensures robots stay within bounds.
2. **`Robot` Class**: Tracks the robot's position and handles movements and rotations.
3. **`Controller` Class**: Manages multiple robots and runs their commands sequentially.
4. **`parseInput()` Function**: Parses the input data into structured format.
5. **`main()` Function**: The entry point that initializes the plateau and processes robots' movements.

## How to Run

### Prerequisites
- Node.js
- TypeScript (install with `npm install -g typescript`)

### Steps
1. Clone the repository:
2. Navigate to the project directory:
    ```bash
    cd europa-robot-navigation
    ```
3. Install the node modules:
    ```bash
    npm install
    ```
4. Compile TypeScript code:
    ```bash
    npx tsc navigation.ts
    ```
5. Run the compiled JavaScript:
    ```bash
    node navigation.js
    ```

### Custom Input
Modify the inputData variable in main.ts to test with different inputs.
