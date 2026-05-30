import { Ship } from "../ship/Ship.js";

export class GameBoard {
    constructor () {
        this.rows  = 24;
        this.cols  = 24;
        this.fleet = [];

        this.grid = Array.from({ length: this.rows }, () => 
            Array.from({ length: this.cols }, () => ({
                hit:  false,
                miss: false,
                ship: null,
            }))
        );
    }

    validateCoords (x, y) {
        if (x >= this.rows || x < 0) return false;
        if (y >= this.cols || y < 0) return false;
        return true;
    }

    validateShipCoords (ship, x, y) {
        if (x + ship.length > this.rows) return false;
        if (y + ship.length > this.cols) return false;
        
        for (let i = 0; i < ship.length; i++) {
            if (this.grid[x+i][y].ship !== null) return false;
        }
        for (let i = 0; i < ship.length; i++) {
            if (this.grid[x][y+i].ship !== null) return false;
        }
        return true;
    }

    createShip (hp) {
        return new Ship(hp);
    }

//do vertical placement later
    placeShip (ship, x, y) {
        if (!this.validateCoords(x, y)) return;
        if (!this.validateShipCoords(ship, x, y)) return;

        for (let i = 0; i < ship.length; i++) {
            this.grid[x+i][y].ship = ship;
        }
        this.extendFleet(ship);
    }
//might not need x and y
// Generate a random row index.
// Use that index to get the row array.
// Use that row array's length to generate a random column index.
// Now you have:
// the coordinates (rowIndex, colIndex)
// and you can access the object stored there if needed.
    placeShipRandomly (ship, x, y) {
        const randomRow = Math.floor(Math.random() * this.grid.length);
        const rowIndex = this.grid[randomRow]
        const randomCol = Math.floor(Math.random() * rowIndex.length);

    }

    extendFleet (ship) {
        this.fleet.push(ship);
    }

    receiveAttack (x, y) {
        if (this.grid[x][y].hit === true) return;
        if (!this.validateCoords(x, y)) return;
        this.grid[x][y].hit = true;

        if (this.grid[x][y].ship === null) {
            this.missedAttack(x, y)
        } else {
            this.grid[x][y].ship.isHit();
            this.grid[x][y].ship.isSunk();
        }
    }

    missedAttack (x, y) {
        this.grid[x][y].miss = true;
    }

    allShipsSunk () {
        if (this.fleet.some(ship => ship.sunk === false)) return false;
        return true;
    }
}

// Your grid is an array of arrays of objects:

// this.grid → outer array (rows)
// Each row → inner array (columns)
// Each column entry → an object containing hit, miss, and ship

// Conceptually, it looks like:

// [
//   [object, object, object],
//   [object, object, object],
//   [object, object, object]
// ]

// So when you generate a random row index, you're selecting which inner array (row) to use.

// When you generate a random column index, you're selecting which object within that row to use.

// For example, if:

// randomRow = 2
// randomCol = 1

// then:

// (2, 1) are the coordinates
// the object stored at those coordinates is:
// {
//   hit: false,
//   miss: false,
//   ship: null
// }

// One thing to notice in your original code is that randomRow is just a number. If you want to know how many columns are available, you need to look at the row array itself, not the row index.

// A good way to reason through it is:

// Generate a random row index.
// Use that index to get the row array.
// Use that row array's length to generate a random column index.
// Now you have:
// the coordinates (rowIndex, colIndex)
// and you can access the object stored there if needed.

// For future reference:

// Coordinates = row index + column index.
// Object = the value stored at those coordinates.
// Row = an entire inner array.
// Grid = the entire 2D structure.

// A quick check for your understanding: if randomRow happened to be 4, what do you think this.grid[4] would return—an object, a coordinate, or something else?