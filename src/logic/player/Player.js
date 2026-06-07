import { GameBoard } from "../gameboard/Gameboard.js"

export class Player {
    constructor () {
        this.board = new GameBoard();
    }

    initialiseShip (hp, x, y) {
        const newShip = this.board.createShip(hp);
        this.board.placeShip(newShip, x, y);
    }

    initialiseFleet () {
        this.board.placeShipRandomly(newShip);
    }

    attack (enemyBoard, x, y) {
        enemyBoard.receiveAttack(x, y);
    }
}