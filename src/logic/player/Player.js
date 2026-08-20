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

// Yes — seeing these classes makes the architecture much clearer.

// You are actually very close. Your Controller already has the path to the grid:

// Controller → Player → GameBoard → grid

// So I wouldn't add three methods just to pass the grid upward.

// What I'd do next
// 1. Decide what the Controller needs from Player

// Your Controller has:

// player1
// player2
// computer

// And each Player has:

// board

// So if the Controller needs player 1's grid, it already conceptually has access to:

// player1 → board → grid

// The question is whether you want the Controller accessing board directly.

// I'd say this is the point where I'd introduce a small abstraction.

// Your Player should be able to answer questions about its own board.

// For example, conceptually:

// "Player, give me your current board."

// Then the Controller doesn't need to know that Player internally calls it board, or that the board is a GameBoard.

// That gives you:

// Controller → Player → GameBoard

// rather than:

// Controller → Player → GameBoard → internal implementation details

// 2. Don't make the Controller responsible for GameBoard internals

// This is the key thing I'd change in your thinking.

// Right now your Controller could potentially do something equivalent to:

// "Go into player1, get their board, then go into that board and get its grid."

// It works.

// But the Controller shouldn't really care how a Player stores their board.

// The Player's responsibility is to represent a player.

// So if the Controller asks:

// "What's your board state?"

// Player handles the fact that the board happens to live inside this.board.

// 3. Then the Controller gives the state to the DOM

// Your eventual flow could therefore be:

// DOM
// → user clicks something

// ↓

// Controller
// → tells Player/GameBoard to perform an action

// ↓

// GameBoard
// → modifies grid

// ↓

// Controller
// → asks Player for the updated board state

// ↓

// DOM
// → renders it

// That's the important loop.

// 4. You don't need to constantly "send" the grid around

// This is another thing that might be tripping you up.

// Your grid is an object living inside the GameBoard.

// You don't need to physically move it:

// GameBoard → Player → Controller → DOM

// Instead, the objects can hold references to each other.

// Your current structure already does that:

// Controller
// │
// ├── player1
// │     └── board
// │           └── grid
// │
// ├── player2
// │     └── board
// │           └── grid
// │
// └── computer

// So the grid isn't trapped.

// The Controller can reach it because the Controller owns the Player, and the Player owns the GameBoard.

// 5. I'd make one architectural decision before touching the DOM

// Ask yourself:

// Does my DOM need the actual GameBoard, or does it only need the information necessary to render it?

// I'd strongly recommend the second.

// The DOM shouldn't know about:

// GameBoard
// Player
// ships
// receiveAttack()
// placeShip()
// checkFleet()

// It should essentially receive:

// "Here is the current state of this board. Render it."

// That keeps your DOM dumb, which is exactly what you want.

// One unrelated thing I noticed

// Your setShipDirection() currently has a problem:

// const direction = direction === ...

// You're declaring direction and then trying to read direction while declaring it. You presumably meant to base the new direction on the existing orientation somewhere.

// Also, your Player doesn't currently expose any way for the Controller to ask about its board state. That's the first thing I'd think about adding.

// So I would proceed in this order:

// GameBoard
// → establish how board state can be read

// Player
// → expose the relevant board state to whoever coordinates the player

// Controller
// → retrieve the state from the Player

// DOM
// → accept that state and render it

// You don't need to change your overall class hierarchy. You're basically just defining the public interface between each existing layer.