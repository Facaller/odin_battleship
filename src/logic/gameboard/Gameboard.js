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

    placeShip (ship, x, y) {
        if (x > this.rows || x < 0) return null;
        if (y > this.cols || y < 0) return null;
        if (x + ship.length > this.rows) return null;
        if (y + ship.length > this.cols) return null;

        for (let i = 0; i < ship.length; i++) {
            this.grid[x+i][y].ship = ship;
        }
    }
}