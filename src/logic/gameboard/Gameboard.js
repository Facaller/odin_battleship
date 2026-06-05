import { Ship } from "../ship/Ship.js";

export class GameBoard {
    constructor () {
        this.rows   = 24;
        this.cols   = 24;
        this.fleet  = [];
        this.shipHp = [7, 5, 5, 4, 4, 3, 2];
        this.orientation = 'horizontal';

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

    createRandomCoords () {
        const randomRowIndex = Math.floor(Math.random() * this.grid.length);
        const randomRow      = this.grid[randomRowIndex];
        const randomColIndex = Math.floor(Math.random() * randomRow.length);

        return [randomRowIndex, randomColIndex];
    }

    setOrientation (direction) {
        this.orientation = direction;
    }

    createShip (hp) {
        return new Ship(hp);
    }

    placeShip (ship, x, y) {
        if (!this.validateCoords(x, y)) return false;
        if (!this.validateShipCoords(ship, x, y)) return false;

        if (this.orientation === 'horizontal') {
            for (let i = 0; i < ship.length; i++) {
                this.grid[x+i][y].ship = ship;
            }
        } else {
            for (let i = 0; i < ship.length; i++) {
                this.grid[x][y+i].ship = ship;
            }
        }

        this.extendFleet(ship);
        return true;
    }

    placeShipRandomly (ship) {
        let success = false;
        
        while (!success) {
            const [x, y] = this.createRandomCoords();
            success = this.placeShip(ship, x, y);
        }
    }

    extendFleet (ship) {
        this.fleet.push(ship);
    }

    fillFleet () {
        while (this.fleet.length < 7) {
            this.shipHp.forEach(hp => {
                const newShip = this.createShip(hp);
                this.placeShipRandomly(newShip);
            });
        }
    }

    receiveAttack (x, y) {
        if (!this.validateCoords(x, y)) return;
        if (this.grid[x][y].hit === true) return;
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

// How ship placement usually works (no drag-and-drop)

// You separate the system into two layers:

// 1. Game logic layer (your Gameboard)

// This layer only cares about:

// ship length
// starting coordinates
// orientation
// validity checks
// updating the grid

// It does not care how the user picked the spot.

// So your placement function conceptually only needs:

// “Place a ship at (x, y) going horizontal or vertical.”

// That’s it.

// 2. UI layer (your clicks or controls)

// This layer decides:

// where the user clicked
// what ship is currently selected
// what orientation is active

// Then it calls:

// “Gameboard, place this ship here.”

// So what does the flow look like?
// Example manual placement (click-based)
// User selects a ship (e.g. “Destroyer”)
// User clicks a cell on the grid (say (3, 5))
// User has orientation set (horizontal/vertical)
// UI calls Gameboard:

// place ship of length 3 at (3, 5), horizontal

// Important insight

// You do NOT need:

// dragging
// Ship objects being moved around visually
// Ship objects existing before placement (necessarily)

// You only need:

// coordinates + orientation + ship length

// That’s enough to fully define placement in Battleship.

// Where your current shipHp fits perfectly

// Your array:

// [7, 5, 5, 4, 4, 3, 2]

// already defines your fleet.

// So placement becomes:

// Take next ship length
// Ask Gameboard to place it
// Gameboard creates ship internally
// Gameboard fills grid

// That’s a complete system without any drag-and-drop complexity.

// What drag-and-drop would change (later)

// If you did implement drag-and-drop, the only thing that changes is:

// Instead of clicking a cell
// You drag a ship element onto a cell

// But the final call is identical:

// “Place ship at (x, y), orientation”

// So your Gameboard logic would not change much at all.

// The key takeaway

// You are overthinking the UI right now (very common at this stage).

// Your Gameboard should only care about this contract:

// “Given a length, position, and orientation, place a ship if valid.”

// Everything else—dragging, clicking, random placement—is just different ways of producing those inputs.