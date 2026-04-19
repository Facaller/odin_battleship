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
//do vertical placement later
    placeShip (ship, x, y) {
        if (!this.validateCoords(x, y)) return;
        if (!this.validateShipCoords(ship, x, y)) return;

        for (let i = 0; i < ship.length; i++) {
            this.grid[x+i][y].ship = ship;
        }
        this.extendFleet(ship);
    }

    extendFleet (ship) {
        this.fleet.push(ship);
    }

    receiveAttack (x, y) {
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