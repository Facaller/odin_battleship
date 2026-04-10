import { Ship } from "../ship/Ship.js";

export class GameBoard {
    constructor () {
        const rows = 24;
        const cols = 24;

        this.grid = Array.from({ length: rows }, () => 
            Array.from({ length: cols }, () => ({
                hit:  false,
                miss: false,
                ship: null,
            }))
        );
    }

    placeShip (ship, x, y) {
        for (let i = 0; i < ship.length; i++) {
            this.grid[x+i][y].ship = true;
        }
    }
}