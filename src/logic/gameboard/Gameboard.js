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

    checkCoordsForShip (ship, x, y) {
        if (x >= this.rows || x < 0) return false;
        if (y >= this.cols || y < 0) return false;
        if (x + ship.length > this.rows) return false;
        if (y + ship.length > this.cols) return false;
        
        for (let i = 0; i < ship.length; i++) {
            if (this.grid[x+i][y].ship !== null) return false;
        }
        return true;
    }
//do vertical placement later
    placeShip (ship, x, y) {
        if (!this.checkCoordsForShip(ship, x, y)) return;
        for (let i = 0; i < ship.length; i++) {
            this.grid[x+i][y].ship = ship;
        }
        this.extendFleet(ship);
    }

    extendFleet (ship) {
        this.fleet.push(ship);
    }

    missedAttack (x, y) {
        if (!this.checkCoordsForShip(x, y)) {
            this.grid[x][y].miss = true;
            return true;
        } else {
            return false
        }
    }

    receiveAttack (x, y) {
        this.grid[x][y].hit = true;
        if (this.missedAttack(x, y)) {
            return;
        } else {
            this.grid[x][y].ship.isHit();
            this.grid[x][y].ship.isSunk();
        }
    }


}