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

    createShip (hp) {
        return new Ship(hp);
    }

    placeShip (x, y) {
        const ship = this.barracks[0];

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
        const deployedShip = this.barracks.splice(0, 1);
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
            this.placeShipRandomly();
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