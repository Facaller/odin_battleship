export class GameBoard {
    constructor () {
        this.rows = 24;
        this.cols = 24;

        this.grid = Array.from({ length: this.rows }, () => 
            Array.from({ length: this.cols }, () => ({
                hit:  false,
                miss: false,
                ship: null,
            }))
        );
    }

    checkCoordsForShip (x, y) {
        if (this.grid[x][y].ship !== null) {
            return true
        } else {
            return false;
        }
    }
//do vertical placement later
    placeShip (ship, x, y) {
        if (x > this.rows || x < 0) return null;
        if (y > this.cols || y < 0) return null;
        if (x + ship.length > this.rows) return null;
        if (y + ship.length > this.cols) return null;

        for (let i = 0; i < ship.length; i++) {
            if (this.checkCoordsForShip(x+i, y)) return null;
            this.grid[x+i][y].ship = ship;
        }
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