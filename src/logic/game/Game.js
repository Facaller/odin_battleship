import { Player } from "../player/Player.js";
import { Computer } from "../computer/computer.js";

class Controller {
    constructor () {
        this.player1  = new Player();
        this.player2  = new Player();
        this.computer = new Computer();

        this.gameState = {
            status:   "strategy",
            turn:     this.player1,
            enableAi: false,
            winner:   null
        }
    }

    changeStatus (status) {
        this.gameState.status = status;
    }

    nextTurn () {
        this.gameState.turn = 
        this.gameState.turn === this.player1 ? this.player2 : this.player1
    }

    battleAi () {
        if (this.gameState.status !== "strategy") return;

        this.gameState.enableAi = this.gameState.enableAi === true ? false : true;
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

    startGame () {
        if (this.gameState.status !== "strategy") return false;
        if (!this.gameState.turn.isFleetReady()) return false;

        if (this.gameState.status === "strategy" && 
            this.gameState.turn.isFleetReady()) {
            this.changeStatus("playing");
            return true;
        }
    }

    setShip (x, y) {
        if (this.gameState.status !== "strategy") return;

        this.gameState.turn.initialiseShip(x, y);
        this.startGame();
    }

    createPlayerFleet () {
        if (this.gameState.status !== "strategy") return;

        this.gameState.turn.initialiseFleet();

        if (this.gameState.enableAi === true) {
            this.nextTurn();
            this.gameState.turn.initialiseFleet();
        }
        this.startGame();
    }

    playTurn (x, y) {
        if (this.gameState.status !== "playing") return;

        const opponent = this.getOpponent(this.gameState.turn);

        this.gameState.turn.attack(opponent, x, y);
        
        if (this.checkWinCondition()) return;
        
        this.this.nextTurn();
        this.playAiTurn();
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