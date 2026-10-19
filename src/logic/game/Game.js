import { Player } from "../player/Player.js";
import { Computer } from "../computer/computer.js";

export class Controller {
    constructor () {
        this.player1  = new Player();
        this.player2  = new Player();
        this.computer = new Computer();

        this.gameState = {
            status:   "strategy",
            turn:     this.player1,
            enableAi: true,
            winner:   null
        }
    }
//start with AI and make it default 
    changeStatus (status) {
        this.gameState.status = status;
    }

    nextTurn () {
        this.gameState.turn = 
        this.gameState.turn === this.player1 ? this.player2 : this.player1
    }

    toggleBattleAi () {
        if (this.gameState.status !== "strategy") return false;

        this.gameState.enableAi = 
        this.gameState.enableAi === true ? false : true;
        return true;
    }

    toggleOrientation () {
        if (this.gameState.status !== "strategy") return false;
        
        this.gameState.turn.toggleOrientation();
        return true;
    }

    assignWinner (winner) {
        this.gameState.winner = winner;
    }

    getOpponent (player) {
        if (player === this.player1) {
            return this.player2;
        } else {
            return this.player1;
        }
    }

    getPlayerOneGrid () {
        return this.getPlayerGrid(this.player1);
    }

    getPlayerTwoGrid () {
        return this.getPlayerGrid(this.player2);
    }

    getPlayerGrid (player) {
        return player.board.grid.map(row => 
            row.map(cell => ({
                hit: cell.hit,
                miss: cell.miss,
                ship: cell.ship
                    ? {
                        length: cell.ship.length,
                        hit: cell.ship.hit,
                        sunk: cell.ship.sunk
                    }
                    : null
            }))
        );
    }

    handleBoardClicks (x, y) {
        if (this.gameState.status === "strategy") {
            return this.setShip(x, y);
        } else if (this.gameState.status === "playing") {
            return this.playTurn(x, y);
        }
    }

    startGame () {
        if (this.gameState.status !== "strategy") return false;
        if (!this.gameState.turn.isFleetReady()) return false;

        if (this.gameState.status === "strategy" && 
            this.gameState.turn.isFleetReady()) {
            this.changeStatus("playing");
            return true;
        }
    }
// take start game out here. new idea:
// check fleet after every placement
// if fleet is ready & AI is on switch turns
// do random deployment
// call start game elsewhere, not in setShip
    setShip (x, y) {
        if (this.gameState.status !== "strategy") return false;

        const placed = this.gameState.turn.initialiseShip(x, y);
        if (!placed) return false;
        
        this.startGame();
        console.log('ship set successfully');
        return  true;
    }

    createPlayerFleet () {
        if (this.gameState.status !== "strategy") return false;

        const placed = this.gameState.turn.initialiseFleet();
        if (!placed) return false;

        if (this.gameState.enableAi === true) {
            this.nextTurn();
            this.gameState.turn.initialiseFleet();
        }
        
        return this.startGame();
    }

    playTurn (x, y) {
        if (this.gameState.status !== "playing") return false;

        const opponent = this.getOpponent(this.gameState.turn);

        this.gameState.turn.attack(opponent, x, y);
        
        if (this.checkWinCondition()) return;
        
        this.nextTurn();
        this.playAiTurn();
        return true;
    }

    getAiCoords () {
        return this.computer.takeRandomMove();
    }

    playAiTurn () {
        if (this.gameState.enableAi !== true) return ;
        
        const opponent = this.getOpponent(this.gameState.turn);
        const [a, b] = this.getAiCoords();
        
        this.gameState.turn.attack(opponent, a, b);
        
        if (this.checkWinCondition()) return;
        
        this.nextTurn();
    }

    checkWinCondition () {
        if (this.gameState.turn.board.allShipsSunk()) {
            this.changeStatus("finish");
            this.assignWinner(this.getOpponent(this.gameState.turn));
            return true;
        }
        return false;
    }

}