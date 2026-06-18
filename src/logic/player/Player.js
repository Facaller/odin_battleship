import { GameBoard } from "../gameboard/Gameboard.js"

export class Player {
    constructor () {
        this.board = new GameBoard();
        this.board.initialiseBarracks();
    }

    initialiseShip (x, y) {
        this.board.placeShip(x, y);
    }

    initialiseFleet () {
        this.board.deployFleet();
    }
//set ship direction
    shipDirection (direction) {
        
    }

    attack (enemyBoard, x, y) {
        enemyBoard.receiveAttack(x, y);
    }
}