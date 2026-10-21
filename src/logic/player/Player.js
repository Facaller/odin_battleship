import { GameBoard } from "../gameboard/Gameboard.js"

export class Player {
    constructor () {
        this.board = new GameBoard();
        this.board.initialiseBarracks();
    }

    initialiseShip (x, y) {
        const placed = this.board.placeShip(x, y);

        if (!placed) return false;
        return true;
    }

    initialiseFleet () {
        const placed = this.board.deployFleet();
        
        if (!placed) return false;
        return true;
    }

    isFleetReady () {
        return this.board.checkFleet() ;
    }

    toggleOrientation () {
        this.board.toggleOrientation();
    }

    attack (enemyBoard, x, y) {
        enemyBoard.receiveAttack(x, y);
    }
}