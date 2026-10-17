import { Ship } from "../ship/Ship.js";
export class GameBoard {
    constructor () {
        this.rows     = 12;
        this.cols     = 12;
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
//need to add creation method here and filter all the way up
    validateCoords (x, y) {
        if (x >= this.rows || x < 0) return false;
        if (y >= this.cols || y < 0) return false;
        return true;
    }

    validateShipCoords (ship, x, y) {
        if (this.orientation === 'horizontal') {
            if (x + ship.length > this.rows) return false;
            
            for (let i = 0; i < ship.length; i++) {
                if (this.grid[x + i][y].ship !== null) return false;
            }
        } else {
            if (y + ship.length > this.cols) return false;

            for (let i = 0; i < ship.length; i++) {
                if (this.grid[x][y + i].ship !== null) return false;
            }
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

    randomizeOrientation () {
        const random = Math.floor(Math.random() * 10);
        if (random % 2 === 0) {
            this.setOrientation('horizontal');
        } else {
            this.setOrientation('vertical');
        }
    }

    createShip (hp) {
        return new Ship(hp);
    }

    placeShip (x, y) {
        const ship = this.barracks[0];

        if (!this.validateCoords(x, y)) return false;
        if (!this.validateShipCoords(ship, x, y)) return false;

        if (this.orientation === 'horizontal') {
            for (let i = 0; i < ship.length; i++) {
                this.grid[x + i][y].ship = ship;
            }
        } else {
            for (let i = 0; i < ship.length; i++) {
                this.grid[x][y + i].ship = ship;
            }
        }

        this.deployShip();
        return true;
    }

    placeShipRandomly () {
        let success = false;
        
        while (!success) {
            const [x, y] = this.createRandomCoords();
            success = this.placeShip(x, y);
        }
    }

    extendBarracks (ship) {
        this.barracks.push(ship);
    }

    deployShip () {
        const deployedShip = this.barracks.shift();
        this.fleet.push(deployedShip);
    }

    initialiseBarracks () {
        this.shipHp.forEach(hp => {
            const newShip = this.createShip(hp);
            this.extendBarracks(newShip);
        });
    }

    deployFleet () {
        while (this.barracks.length > 0) {
            this.randomizeOrientation();
            this.placeShipRandomly();
        }

        if (this.barracks.length === 0) return true;
    }

    checkFleet () {
        if (this.barracks.length === 0 && this.fleet.length === 7) return true;
        
        return false;
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

// Your GameBoard is actually a great place to start because it has the most concrete knowledge of what changed.

// placeShip() is the obvious one

// Right now:

// if (!this.validateCoords(x, y)) return false;
// if (!this.validateShipCoords(ship, x, y)) return false;

// // place ship...

// this.deployShip();
// return true;

// After the loops run, placeShip() knows exactly which cells it modified.

// So rather than thinking:

// "What object should I return?"

// first think:

// "What information do I now possess that the next layer will need?"

// You know:

// the starting coordinate
// the orientation
// the ship
// the ship's length
// therefore every coordinate that was modified

// So you could have placeShip() return something representing those changed cells.

// For example, conceptually:

// {
//     cells: [
//         { row: 3, col: 5 },
//         { row: 4, col: 5 },
//         { row: 5, col: 5 }
//     ]
// }

// I'm not saying you need to use exactly that shape — design the shape yourself — but that's the sort of information you're looking for.

// Then this information can travel upward:

// GameBoard.placeShip()
//         ↓
// Player.initialiseShip()
//         ↓
// Controller.setShip()
//         ↓
// Controller.handleBoardClicks()
//         ↓
// Handler.handleBoardClicks()
//         ↓
// DOM

// Each layer can add/contextualize information as necessary.

// receiveAttack() is probably even more important

// Currently:

// receiveAttack (x, y) {
//     if (!this.validateCoords(x, y)) return;
//     if (this.grid[x][y].hit === true) return;

//     this.grid[x][y].hit = true;

//     if (this.grid[x][y].ship === null) {
//         this.missedAttack(x, y)
//     } else {
//         this.grid[x][y].ship.isHit();
//         this.grid[x][y].ship.isSunk();
//     }
// }

// This method knows exactly what happened to the cell.

// It knows:

// Was it valid?
// Was it already attacked?
// Was it a miss?
// Was it a hit?
// Did the ship get sunk?

// That's valuable information.

// So rather than having:

// return;

// at various places and eventually returning nothing, I'd consider having the method communicate the result of the attack.

// Something conceptually like:

// {
//     row: x,
//     col: y,
//     result: "hit"
// }

// or:

// {
//     row: x,
//     col: y,
//     result: "miss"
// }

// And perhaps there's additional information you decide you need when a ship sinks.

// Again, don't blindly copy that structure. Work out what your UI actually needs.

// But keep validateCoords() as a boolean

// This is a good example of where not to change anything.

// validateCoords(x, y) {
//     if (x >= this.rows || x < 0) return false;
//     if (y >= this.cols || y < 0) return false;
//     return true;
// }

// The caller asks:

// "Are these coordinates valid?"

// And the answer is simply:

// Yes / No.

// Perfect.

// Same with something like:

// checkFleet()

// A boolean is perfectly appropriate there.

// So don't fall into:

// "Objects are better, therefore everything should return an object."

// It's really:

// Return the simplest piece of information that the caller needs.

// There's also a nice opportunity with receiveAttack()

// Look at this:

// if (this.grid[x][y].ship === null) {
//     this.missedAttack(x, y)
// } else {
//     this.grid[x][y].ship.isHit();
//     this.grid[x][y].ship.isSunk();
// }

// You might be tempted to make missedAttack() return an object, too.

// I probably wouldn't.

// missedAttack() is an internal operation:

// receiveAttack()
//      ↓
// "it's a miss"
//      ↓
// missedAttack()
//      ↓
// set miss = true

// The useful game event is the attack result, and receiveAttack() is the method that understands the whole attack.

// So I'd probably have receiveAttack() be the place where the meaningful result is assembled.

// And one really important distinction

// You said:

// "Basically, I need to adjust the return lines here on the relevant methods to pass useful information instead of booleans?"

// Yes, but think of it as passing information upward, not necessarily passing the exact same object all the way upward.

// For example:

// GameBoard
// "I was attacked at (4, 6), and it was a hit."

//        ↓

// Player
// "Okay, my board was hit at (4, 6)."

//        ↓

// Controller
// "Player 1 attacked Player 2's board at (4, 6), and it was a hit."

//        ↓

// Handler
// "Update the foe board's cell at (4, 6) to show a hit."

// The Controller is the layer that has the game context.

// GameBoard doesn't need to know that its board is the "foe board."

// It just knows:

// "Cell 4,6 was hit."

// That's a very healthy separation.

// One exercise I'd do before changing your code

// Take these methods:

// placeShip()
// receiveAttack()
// initialiseShip()       ← wherever this lives
// attack()               ← wherever this lives
// setShip()
// playTurn()

// For each one, write:

// What does this method know immediately after it succeeds?
// What does its caller need to know?

// Then you'll naturally discover where your result objects should be created.

// And I think you'll find that you don't actually need many new objects. You just need to stop throwing away useful information with return true.