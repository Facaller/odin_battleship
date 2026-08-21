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

// Ah, yes — with this context, I can see exactly where your question is coming from.

// Your architecture is actually already set up nicely for this. The important thing is that the Controller already has access to the GameBoard indirectly through the Player:

// Controller
//    │
//    ├── player1
//    │      └── board
//    │           └── grid
//    │
//    └── player2
//           └── board
//                └── grid

// So your Controller doesn't need to create or know how to construct a GameBoard. It already has one through each Player.

// At startup, I'd think about it like this

// Your application starts:

// DOMContentLoaded

// ↓

// Create Controller

// ↓

// Controller creates:

// player1
// player2
// computer

// ↓

// Each Player creates its own:

// GameBoard
// barracks
// grid

// At this point, your game state exists entirely in JavaScript, but nothing has been drawn yet.

// That's where your DOM layer comes in.

// The Controller becomes the bridge

// Your Controller knows:

// "My player has a board."

// Your DOM knows:

// "I need to create visual cells."

// So your startup process could conceptually be:

// DOMContentLoaded

// → instantiate Controller

// → instantiate DOM

// → Controller gets player1.board

// → Controller asks DOM to render/display that board

// The crucial point is that the DOM doesn't need to know about Player or GameBoard at all.

// The Controller hands it the relevant information.

// For example, conceptually:

// Controller: "DOM, here's player 1's board. Render it."

// The DOM:

// "Cool. It's 12 × 12. I'll create 144 cells."

// And you actually have two boards to think about

// This is worth considering now because it'll affect your DOM API.

// Eventually your UI probably has something like:

// PLAYER BOARD          ENEMY BOARD
// ┌──────────────┐      ┌──────────────┐
// │              │      │              │
// │    12 × 12   │      │    12 × 12   │
// │              │      │              │
// └──────────────┘      └──────────────┘

// Those correspond to:

// player1.board
// player2.board

// (or the computer's board, depending on how you've structured the game).

// So your Controller could ultimately be responsible for saying:

// "Render this board in the player's board container."

// and

// "Render that board in the opponent's board container."

// The DOM doesn't care whose board it is. It just receives the board information and the appropriate place to display it.

// One subtle design decision I'd make

// You don't necessarily want your DOM to receive the entire Player object.

// For example, I'd avoid the conceptual relationship:

// DOM → Player → GameBoard

// because now your DOM is aware of game-domain objects.

// Instead:

// Controller → extracts what the DOM needs → DOM

// For your initial rendering, that might simply be the grid.

// So your Controller is effectively saying:

// "Here's the board state you need to visually represent."

// The DOM doesn't know that the state came from:

// player1.board.grid

// It just receives the board representation.

// That keeps your boundary very clean.

// There's also an important distinction between initial rendering and gameplay

// At game start:

// Controller
//    ↓
// player1.board.grid
//    ↓
// DOM
//    ↓
// Create 144 cells

// But once those cells exist, you don't want to repeatedly render the whole board.

// Suppose the player attacks (4, 7).

// You'd have something like:

// Player
//    ↓
// GameBoard.receiveAttack(4, 7)
//    ↓
// grid[4][7] changes
//    ↓
// Controller knows what happened
//    ↓
// DOM updates cell (4, 7)

// That's a very natural fit for the architecture you've already built.

// One unrelated thing I noticed

// Your setShipDirection() currently has a problem:

// const direction = direction === 'horizontal'

// You're declaring direction and then trying to read that same not-yet-initialised variable. I assume you intended to toggle based on the board's current orientation (or have the Board handle the toggle).

// Also, your attack() currently delegates directly to the enemy board, which is fine if that's intentional, but your Controller will eventually be a useful place to coordinate whose turn it is, whether an attack is legal, and what the UI should update afterward.

// Neither of those changes your grid question, though.

// For the grid specifically, your architecture already gives you the path:

// Controller owns Players → Players own Boards → Controller extracts board state → DOM turns that state into visual cells.

// You don't need to change your GameBoard or Player just to make the grid appear.