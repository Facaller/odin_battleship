import { Ship } from "../ship/Ship.js";

export class GameBoard {
    constructor () {
        this.rows     = 24;
        this.cols     = 24;
        this.fleet    = [];
        this.barracks = [];
        this.shipHp   = [7, 5, 5, 4, 4, 3, 2];
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
//use ship hp perhaps to cycle through creation
    createShip (hp) {
        return new Ship(hp);
    }
//needs to consume from barracks.
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

    extendBarracks (ship) {
        this.barracks.push(ship);
    }
// extend fleet needs to take from barracks
    extendFleet (ship) {
        this.fleet.push(ship);
    }

    initialiseBarracks () {
        this.shipHp.forEach(hp => {
            const newShip = this.createShip(hp);
            this.extendBarracks(newShip);
        });
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

// With a barracks approach:

// Game starts.
// All ships are created once.
// Ships are stored in barracks.
// Placement methods consume ships from barracks.
// Successfully placed ships move to fleet.

// Model 2: Fleet exists first, placement happens second

// Another way to think about it:

// Game starts.
// Seven ships are created from [7, 5, 5, 4, 4, 3, 2].
// Those ships sit in a "to be placed" collection.
// User clicks.
// The next unplaced ship gets placed.
// Repeat until none remain.

// Conceptually, this feels a little cleaner because:

// Fleet composition is determined once.
// Placement is a separate concern.
// You never have to ask "which ship size should I create next?"

// You already know.

// What I like about it is that the state becomes easy to reason about:

// Barracks = ships that exist but are not yet deployed.
// Fleet = ships currently on the board.
// Grid = where deployed ships are located.

// Those three concepts have distinct responsibilities.

// Why this feels cleaner

// Right now your fleet appears to mean:

// "Ships that have been successfully placed."

// If that's true, then a separate collection for unplaced ships makes sense because you're no longer trying to make one array represent two different states.

// Instead:

// Unplaced Ship → Barracks
// Placed Ship   → Fleet

// Conceptually that's very easy to understand.

// It also simplifies the placement workflow

// Imagine the user clicks a square.

// The game doesn't need to ask:

// What ship size comes next?

// or

// Which value from shipHp should I use?

// Instead it asks:

// What is the next ship waiting in the barracks?

// That's a simpler question.

// The fleet composition was already decided at game initialization.

// An even more important benefit

// This model handles placement failures naturally.

// Suppose the next ship is length 7.

// The user clicks an invalid location.

// What happens?

// Nothing.

// The ship remains in barracks.

// The user tries again.

// No creation.
// No destruction.
// No special bookkeeping.

// The ship simply hasn't been deployed yet.

// That's usually a sign of a solid model.

// One thing I'd think about

// Ask yourself whether "barracks" is truly a Gameboard responsibility.

// This isn't a criticism—just another design question.

// A board traditionally knows:

// coordinates,
// occupied spaces,
// placed ships.

// It doesn't necessarily know about ships waiting off-board.

// So there are two valid interpretations:

// Option A

// Gameboard owns barracks and fleet.

// Option B

// Some higher-level game controller owns barracks.
// Gameboard only owns placed ships.

// For Odin Project purposes, either is perfectly reasonable.

// I'd lean toward whichever requires less plumbing in your current architecture.

// Another subtle benefit

// Notice how your shipHp array changes role.

// Currently it's acting as:

// "Data I need during placement."

// With the barracks idea it becomes:

// "The blueprint used to construct the fleet at game initialization."

// That feels more natural to me.

// The array becomes setup data rather than runtime state.

// My only caution

// I would avoid making placement dependent on:

// barracks being empty,
// fleet length being some specific value,
// shipHp length,
// multiple sources of truth.

// Try to keep one authoritative answer to:

// Are there ships left to place?

// If barracks contains the unplaced ships, then:

// Barracks empty = placement phase complete.

// That's a very clean invariant.