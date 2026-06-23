import { Player } from "../player/Player.js";
import { Computer } from "../computer/computer.js";

class Controller {
    constructor () {
        this.player1  = new Player();
        this.player2  = new Player();
        this.computer = new Computer();

        this.gameState = {
            status: "strategy",
            turn:   this.player1,
            playAi: false,
            winner: "undecided"
        }
    }

    changeStatus (status) {
        this.gameState.status = status;
    }

    changeTurn (turn) {
        this.gameState.turn = turn;
    }

    assignWinner (winner) {
        this.gameState.winner = winner;
    }

    beginPlaying () {
        this.changeStatus("playing");
    }

    getOpponent (player) {
        if (player === this.player1) {
            return this.player2;
        } else {
            return this.player1;
        }
    }

    setShip (x, y) {
        if (this.gameState.status !== "strategy") return;

        this.gameState.turn.initialiseShip(x, y);
    }

    createPlayerFleet () {
        if (this.gameState.status !== "strategy") return;

        this.gameState.turn.initialiseFleet();

        if (this.gameState.playAi === true) {
            this.changeTurn(this.player2);
            this.gameState.turn.initialiseFleet();
        }
    }

    playTurn (x, y) {
        if (this.gameState.status !== "playing") return;

        if (this.gameState.turn === this.player1) {
            this.player1.attack(this.player2.board, x, y);
            this.changeTurn(this.player2);
        } else {
            if (this.gameState.playAi === true) {
                const [r, c] = this.playTurnAi();
                this.player2.attack(this.player1.board, r, c);
                this.changeTurn(this.player1);
            }
            this.player2.attack(this.player1.board, x, y);
            this.changeTurn(this.player1);
        }
    }

    playTurnAi () {
        return this.computer.takeRandomMove();
    }

    checkWinCondition () {
        if (this.player1.board.allShipsSunk()) {
            this.changeStatus("finish");
            this.assignWinner("Player2");
        }
        if (this.player2.board.allShipsSunk()) {
            this.changeStatus("finish");
            this.assignWinner("Player1");
        }
    }

}