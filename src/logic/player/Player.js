import { GameBoard } from "../gameboard/Gameboard.js"

export class Player {
    constructor () {
        this.board = new GameBoard();
    }

    initialiseShip (hp, x, y) {
        const newShip = this.board.createShip(hp);
        this.board.placeShip(newShip, x, y);
    }
}

// Mental model to lock in

// If you keep this separation, everything stays clean:

// Player
// owns a board
// decides actions (attack, placement)
// GameBoard
// enforces rules
// stores all state
// Ship
// tracks hits and sunk status
// So what should you add right now?

// At this stage, the Player only needs to be capable of:

// Existing with a board
// Initiating actions (attack, placement)

// That’s it.

// If your Player can:

// Tell its board to place ships
// Attack another player’s board

// you’ve already got the correct foundation.