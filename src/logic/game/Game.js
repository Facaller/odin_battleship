import { Player } from "../player/Player.js";

class Controller {
    constructor () {
        this.player1 = new Player();
        this.player2 = new Player();

        this.gameState = {
            status: "strategy",
            turn:   this.player1
        }
    }

    changeGameState (status) {
        return this.gameState.status = status;
    }

    changeTurn (turn) {
        return this.gameState.turn = turn;
    }

    playTurn () {
        if (this.gameState.turn === this.player1) {
            this.player1.attack(this.player2.board, x, y);
            this.changeTurn(this.player2);
        } else {
            this.player2.attack(this.player1.board, x, y);
            this.changeTurn(this.player1);
        }
    }

    checkWinCondition () {
        if (this.player1.board.allShipsSunk() || this.player2.board.allShipsSunk()) {
            this.changeGameState("finish");
            
        }
    }

}





// 1. A “Game Controller” (logic, no DOM)

// This is the module that runs the game.

// It should:

// Create two players
// Track whose turn it is
// Tell a player to attack the other player’s board
// Check for win conditions
// Switch turns
// Trigger the computer’s move

// It should not:

// Touch the DOM
// Know anything about clicks or rendering

// Think of it as the referee.

// 2. A DOM/UI module (rendering + events)

// This is what they mean by:

// “Create a module that helps you manage actions that should happen in the DOM”

// This module should:

// Render both boards
// Attach click listeners to the enemy grid
// Call the controller when the user clicks
// Re-render after every move

// It should not:

// Contain game rules
// Decide hits/misses
// Track turns
// The key misunderstanding to avoid

// When they say:

// “drive the game using event listeners”

// They don’t mean:

// “put all logic inside event listeners”

// They mean:

// “event listeners should trigger your game logic”

// So the flow should feel like:

// User clicks a square (DOM module)
// DOM module calls controller
// Controller tells Player → Gameboard to resolve attack
// Controller updates turn / checks win
// DOM module re-renders boards
// What you should build next (practical order)
// Step 1: Hardcode a playable game (no UI complexity yet)
// Create two players in your controller
// Place ships with fixed coordinates
// Simulate turns manually (even with console logs)

// Goal: prove your logic works end-to-end

// Step 2: Basic rendering

// In your DOM module:

// Render a grid for each Gameboard
// Use your Gameboard’s internal state to decide:
// empty
// ship (maybe hidden for enemy)
// hit
// miss
// Step 3: Click → attack flow
// Add click listeners to the enemy board
// When clicked:
// send coordinates to controller
// controller processes attack
// re-render
// Step 4: Turn system

// In your controller:

// Track current player
// After each valid move:
// switch player
// trigger computer move if needed
// Step 5: Computer player

// Keep it simple:

// Random coordinates
// Retry if already attacked

// Important:
// This logic belongs in either:

// Player (if you give it a “computer mode”), or
// Controller (simpler for this project)
// Step 6: Win condition

// Controller checks:

// “Are all ships sunk on this board?”

// Then:

// Stop the game
// Tell DOM module to display winner
// Step 7 (last): Ship placement UI

// This is intentionally last because it’s messy.

// Start simple:

// Button for random placement
// or
// Manual coordinate input

// Don’t over-engineer drag-and-drop unless you really want to.