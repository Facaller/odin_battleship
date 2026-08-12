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
        this.board.deployFleet();
    }

    isFleetReady () {
        if (this.board.checkFleet()) return true;

        return false;
    }

    setShipDirection () {
        const direction = direction === 'horizontal' ? 'vertical' : 'horizontal';
        this.board.setOrientation(direction);
    }

    attack (enemyBoard, x, y) {
        enemyBoard.receiveAttack(x, y);
    }
}