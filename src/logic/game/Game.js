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
        if (this.gameState.status !== "strategy") return false;

        this.gameState.enableAi = this.gameState.enableAi === true ? false : true;
        return true;
    }

    setOrientation () {
        if (this.gameState.status !== "strategy") return false;
        
        this.gameState.turn.setShipDirection();
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

    setShip (x, y) {
        if (this.gameState.status !== "strategy") return false;

        const placed = this.gameState.turn.initialiseShip(x, y);
        if (!placed) return false;
        
        this.startGame();
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

// The key idea to keep in mind is that your Gameboard should be the source of truth, and your DOM should be a visual representation of that state.

// Step 1: Decide what updateBoard is responsible for
// Look at your existing methods:

// getPlayerOneGrid() retrieves a copy of player one's grid.

// getPlayerTwoGrid() retrieves a copy of player two's grid.

// renderGrid(grid, gridContainer) creates DOM elements based on a grid.

// updateBoard() is intended to refresh the display after an action.

// Ask yourself: what information does renderGrid() need to do its job?

// You've already given it two parameters:

// The grid data to render.

// The DOM container in which to render it.

// That suggests a useful design principle: keep updateBoard() focused on coordinating the update, rather than making it responsible for figuring out what happened in the game.

// Here's your first question to consider:

// If you want to update the ally grid, how would updateBoard() know which grid data to retrieve and which DOM container to update?

// Think about whether those responsibilities belong inside updateBoard() or in the methods that call it.

// Step 2: Understand what your controller's boolean return values mean
// Currently, your controller methods return booleans from setShip() and attack().

// That's not necessarily a problem. A boolean can communicate something very useful:

// true: the requested action was accepted.

// false: the requested action was rejected.

// Your handleBoardClicks() method already uses this idea:

// It calls the controller.

// It checks the result.

// It stops if the result is falsy.

// Now consider a distinction between two separate questions:

// Did the action succeed?

// What should the board look like after the action?

// A boolean can answer the first question, but it doesn't tell the DOM handler which board state to display.

// However, does it need to? You already have methods that retrieve the current grid state.

// Your next task: Trace what happens after setShip() returns true. The Gameboard has presumably changed. How could your DOM handler retrieve the updated state without needing setShip() to return that state as well?

// Try answering that before changing your controller methods.

// Step 3: Decide whether to return a boolean or data
// There are two reasonable approaches to think about.

// Approach A: Keep the boolean
// The controller reports whether the action was valid. If it was, the DOM handler retrieves the latest grid copy and refreshes the relevant display.

// Best to explore first, given your current architecture.

// Approach B: Return richer information
// The controller returns something that communicates more than success or failure, such as which player was affected or what kind of action occurred.

// This can be useful when the interface needs more information than a simple refresh, but it introduces additional design decisions.

// For your current goal, I would start by exploring Approach A.

// You already have a way to obtain the grid after an action. Returning the entire grid from every action method could duplicate a responsibility that your getter methods already handle.

// One important caveat: if you later need to distinguish between different outcomes, such as a hit, a miss, or a sunk ship, you may want a richer result. You don't need to solve that problem just to get your grid rendering correctly.

// Step 4: Work out which board needs updating
// This is where your question about one parameter versus two becomes interesting.

// Your updateBoard(grid, gridContainer) signature makes sense if its responsibility is to render a supplied grid into a supplied container.

// But your code also has these methods:

// updateAllyBoard()

// updateFoeBoard()

// What do those names suggest about their responsibilities?

// Consider the following design questions:

// Should updateBoard() have to know which player owns the grid?

// Or should updateAllyBoard() and updateFoeBoard() each retrieve the appropriate grid and container, then pass them to updateBoard()?

// If you choose the second option, which method becomes responsible for deciding what to update, and which method simply performs the rendering?

// Notice how this lets you separate the decision about which board from the work of rendering a board.

// You don't need to change the parameter count yet. First, decide which method should own each responsibility.

// Step 5: Follow one click through your code
// Let's mentally trace a click on a cell in the foe grid.

// 1. Board event listener

// Reads the clicked cell's coordinates

// 2. handleBoardClicks(x, y)

// Asks the controller to process the action

// 3. Controller

// Validates the action and updates the game state if appropriate

// 4. DOM handler

// Checks success, then decides which board display needs refreshing

// 5. Retrieve grid and render

// Uses the current Gameboard state to update the display

// There is one detail worth investigating here: your handleBoardClicks(x, y) currently receives coordinates from both board listeners, but it doesn't receive any indication of which board was clicked.

// Ask yourself: Can your controller determine which player or board the coordinates refer to, or does it need more context?

// You may already handle that distinction inside playTurn() or setShip(). If so, great. If not, you'll need to resolve that before the DOM handler can reliably decide which display to refresh.

// Also, because your goal is to rerender after any valid action, think about whether an action can affect one board or both boards. Don't assume that every successful action necessarily affects only the board that received the click.

// Step 6: One rendering detail to watch out for
// Your current renderGrid() creates new rows and cells and appends them to gridContainer.

// What happens if you call it twice on the same container?

// The previous rows aren't automatically removed. You'll end up appending another grid to the existing one.

// Before you wire up updateBoard(), decide how your rendering method should handle existing DOM elements. You could either:

// Clear the container before rebuilding its contents.

// Update existing cells in place rather than recreating the grid.

// For your current stage, rebuilding the grid is simpler to reason about. Just make sure the container doesn't accumulate duplicate rows.

// One more thought: your grid copy contains hit, miss, and ship information, but your current renderer ignores the cell data with row.forEach((_, colIndex) => ...). Eventually, the rendering logic will need to inspect each cell's state to decide how it should appear. Otherwise, rerendering will recreate the grid without showing the changes that occurred.

// Your turn: let's solve the first design decision
// I don't want to jump ahead and give you the implementation, so let's start with one question.

// Imagine setShip(x, y) returns true and the Gameboard has been updated. Your DOM handler now needs to refresh the ally board.

// Step 1: Think about separation of responsibilities
// You've proposed this relationship:

// updateAllyBoard() retrieves the ally's current grid.

// updateBoard() receives that grid and handles the rendering.

// Ask yourself: Does each method now have one clear responsibility?

// Your updateAllyBoard() knows which board you want to refresh. Your updateBoard() doesn't need to know anything about players, game phases, or controller logic. It just needs the data to render and somewhere to render it.

// That's a useful separation of concerns.

// Step 2: Decide what updateBoard() needs
// Look at your existing method:

// renderGrid(grid, gridContainer)

// It already receives two things. Your proposed updateBoard() could follow a similar design.

// Think about the two pieces of information it needs:

// The latest grid state.

// The DOM container that represents that grid.

// Now ask yourself: if updateBoard() receives both of those things, does it need to call the controller at all?

// If the answer is no, you've made the rendering layer more independent of the game logic. That's generally a good thing.

// Step 3: Consider why you have two wrapper methods
// You have both updateAllyBoard() and updateFoeBoard().

// Imagine you later change how the ally grid is retrieved, or how its container is identified. If those details live inside updateAllyBoard(), would you need to change the generic rendering method too?

// Ideally, no.

// The same principle applies to updateFoeBoard(). Each wrapper knows its own board, while the shared rendering method handles the common work.

// This also avoids duplicating rendering logic across the two boards.

// Step 4: Connect this to your boolean return values
// Let's return to your original question.

// Your controller reports whether an action succeeded. Your DOM handler uses that result to decide whether an update is needed.

// Consider this sequence:

// The user clicks a cell.

// The controller attempts the action.

// The action is rejected, so nothing needs to be rerendered.

// Alternatively, the action succeeds, so the handler initiates the appropriate board update.

// The board-update method retrieves the latest state and passes it to the rendering method.

// Notice that the boolean and the grid copy serve different purposes. The boolean tells you whether to update; the grid copy tells you what to display.

// You don't necessarily need to change your controller's return types to achieve this.

// One subtle point: make sure the controller's boolean genuinely means that the action was accepted and the relevant state was updated, rather than merely that the request was processed.

// Step 5: Here's the next problem to solve
// There's one remaining design decision in your current code.

// Both allyBoard and foeBoard call the same method:

// handleBoardClicks(x, y)

// But your method currently receives only coordinates.

// Suppose a valid attack changes the foe's board. How will handleBoardClicks() know whether to call updateAllyBoard() or updateFoeBoard()?

// You have two possible directions to investigate:

// The controller already knows which board an action affects, so you can use that knowledge to determine what to refresh.

// The DOM handler can identify which board received the click and pass that context along.

// Neither choice is automatically right for every game architecture. The important thing is to avoid guessing based solely on the coordinates, because (2, 3) could refer to a cell on either board.

// Your next question
// In your Battleship game, when the user clicks a cell on the foe grid during the playing phase, does your playTurn() method already know that it's attacking player two's board?

// Or does playTurn() currently receive only (x, y) and have to figure out which board to target some other way?

// Tell me how that part works, and we'll reason through the cleanest way to connect a successful action to the correct board update.