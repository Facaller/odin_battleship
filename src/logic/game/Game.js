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

    playAi () {
        this.gameState.playAi = true;
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

        this.gameState.turn.attack(this.getOpponent(), x, y);
        this.changeTurn(this.getOpponent());
        this.playAiTurn();
    }

    getAiCoords () {
        return this.computer.takeRandomMove();
    }

    playAiTurn () {
        if (this.gameState.playAi !== true) return ;
        
        const [a, b] = this.getAiCoords();
        this.gameState.turn.attack(this.getOpponent(), a, b);
    }

    checkWinCondition () {
        if (this.gameState.turn.board.allShipsSunk()) {
            this.changeStatus("finish");
            this.assignWinner(this.getOpponent());
        }
    }

}

// From a game-controller perspective, you've covered most of the core responsibilities:

// Track game state (status, turn, winner)
// Manage turn changes
// Handle setup/fleet creation
// Handle attacks
// Support AI play
// Determine a winner

// So the overall shape looks good.

// A few things stand out that I'd review before moving on to the UI.

// 1. getOpponent() seems to require an argument

// Your method signature is:

// getOpponent(player)

// But later you call:

// this.getOpponent()

// inside playTurn(), playAiTurn(), and checkWinCondition().

// Unless you've omitted something, those calls won't work as intended because player will be undefined.

// You either need to always pass a player, or rethink whether getOpponent() should default to the current turn player.

// 2. AI turn doesn't appear to switch turns back

// In playTurn():

// Human attacks
// Turn changes
// AI plays

// After the AI attacks, I don't see a turn change back to the human.

// So after an AI move, whose turn is it?

// You may already be handling this elsewhere, but from this class alone it looks like the turn would remain with the AI player.

// 3. Win condition isn't being checked

// I don't see checkWinCondition() being called from either:

// playTurn()
// playAiTurn()

// Unless another module handles it, a player could sink the final ship and the game state would never move to "finish".

// 4. Consider whether winner should store a player object

// Currently:

// winner: "undecided"

// Then later:

// assignWinner(winner)

// which appears to receive a player object.

// So winner changes type:

// "undecided" -> Player instance

// That's not necessarily wrong, but it can make reasoning about state harder.

// Many developers prefer either:

// winner: null
// winner: player

// or

// winner: "player1"
// winner: "player2"

// and keep the type consistent.

// 5. playAi naming collision

// You have:

// playAi: false

// inside state and

// playAi()

// as a method.

// JavaScript allows this because one is inside gameState, but the naming is slightly confusing.

// Something like:

// enableAi()
// setAiMode()
// startAiGame()

// communicates intent more clearly.

// 6. Setup flow feels incomplete

// I see:

// setShip()
// createPlayerFleet()

// but I don't see what actually transitions:

// status: "strategy"

// to

// status: "playing"

// There should be some obvious point where setup ends and gameplay begins.

// Maybe that's handled elsewhere, but I'd expect the controller to own that transition.

// 7. Think about game reset

// Before building the UI, ask:

// If the user clicks "New Game", can I do it cleanly?

// A controller usually ends up needing something like:

// reset players
// reset boards
// reset state
// reset winner
// reset turn

// You don't necessarily need it right now, but it's often the first thing people realize they're missing once they start wiring buttons to the DOM.

// 8. Minor design thought: changeTurn()

// Right now:

// changeTurn(turn)

// allows any caller to set any turn.

// For Battleship, turns are strictly alternating.

// Sometimes controllers instead expose something conceptually closer to:

// nextTurn()

// and keep turn logic internal.

// Not a bug—just something to consider.

// Overall

// If your Player, Board, Ship, and Computer classes already handle placement, attacks, hit tracking, sunk ships, validation, etc., then the biggest things I'd verify before starting the UI are:

// getOpponent() calls are correct.
// Turn switching after AI moves.
// Win checks are actually executed.
// Transition from "strategy" → "playing".
// Ability to reset/restart a game.

// Those are the areas most likely to cause headaches once you start connecting buttons and board clicks to the controller.