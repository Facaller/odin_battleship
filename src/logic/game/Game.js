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

// Looking at both modules together, I'd focus less on rendering optimization now and more on making the flow of game actions, state changes, and UI updates predictable. You're at a good stage to establish those habits before the DOM Handler gets much larger.

// There are several good decisions here, but I also see a few genuine logic issues worth addressing before you build further on top of this structure.

// 1. Your biggest issue: playTurn() doesn't reliably communicate what happened
// Consider this section of your controller:

// js
// playTurn (x, y) {
//     if (this.gameState.status !== "playing") return false;

//     const opponent = this.getOpponent(this.gameState.turn);

//     this.gameState.turn.attack(opponent, x, y);

//     if (this.checkWinCondition()) return;

//     this.nextTurn();
//     this.playAiTurn();
//     return true;
// }
// There are two things I'd investigate.

// First, you're ignoring the result of attack().

// What happens if the selected cell has already been attacked? Does attack() reject that move? If so, your controller currently advances the turn regardless, unless that behavior is handled elsewhere.

// Your controller should make the distinction between an invalid action and a valid action explicit. Otherwise, the UI could respond to a move that shouldn't have happened.

// Second, the return value isn't consistent.

// An invalid game phase returns false.

// A winning attack returns undefined.

// A non-winning attack returns true.

// This matters because your DOM Handler uses the return value to decide whether to update the board:

// js
// const result = this.controller.handleBoardClicks(x, y);
// if (!result) return;

// this.updateBoard(result);
// The handler currently treats the return value as both an indication of success and the data needed for rendering, even though your controller returns only a boolean-like result.

// I'd separate those concepts mentally, even if you don't implement a more sophisticated result object yet. Decide what a successful action means, what an invalid action means, and what the view needs to know afterward.

// 2. Your turn-management logic deserves particular attention
// Your controller handles player turns, AI turns, and win detection. That's a reasonable place for this coordination, but the order of operations matters.

// For example, suppose the human player makes a winning attack.

// Your code checks the win condition before calling nextTurn(), which is sensible because the current player is the attacker and should be recorded as the winner.

// But now consider an ordinary human attack against an AI opponent:

// The human attacks.

// The controller checks for a win.

// The turn advances to the AI.

// The AI attacks.

// The controller checks for a win again.

// The turn advances back to the human.

// That sequence is understandable, but it raises a presentation question: what happens if the AI wins?

// Your playAiTurn() returns nothing, and playTurn() returns true after calling it. The DOM Handler therefore receives no explicit indication that the AI has ended the game.

// You can still solve this without complicating your architecture. Just make sure the controller's action result accounts for everything that happens during the complete turn, including the AI's response.

// I'd also avoid letting the DOM Handler independently infer the winner or decide whether the game should advance. Those decisions belong in the game logic.

// 3. setShip() is doing more than its name suggests
// js
// setShip (x, y) {
//     if (this.gameState.status !== "strategy") return false;

//     const placed = this.gameState.turn.initialiseShip(x, y);
//     if (!placed) return false;

//     this.startGame();
//     return true;
// }
// This is one of the more subtle design choices I'd reconsider.

// The method places a ship, but it also attempts to start the game. That couples two operations that conceptually have separate purposes.

// I can see why you've done it: once the fleet is complete, the game should transition into the playing phase. But ask yourself whether placing a ship should be responsible for deciding when the game begins, or whether the game-starting process should be responsible for checking fleet readiness.

// Neither approach is inherently wrong for a small project. The important consideration is whether the method's behavior is predictable from its name.

// I'd lean toward keeping those responsibilities separate. Your startGame() method already exists, so let it own the transition into the playing phase. Your placement method can report whether placement succeeded, and the surrounding game flow can determine what happens next.

// Also, consider whether you actually want the final ship placement to start the game automatically or whether the player should explicitly press Start. That's a gameplay decision as much as an architectural one.

// 4. Your rendering methods need a clearer contract
// This is where your two modules currently disagree.

// Your DOM Handler has:

// js
// updateBoard (grid, gridContainer) {

// }
// But your click handler does this:

// js
// const result = this.controller.handleBoardClicks(x, y);
// if (!result) return;

// this.updateBoard(result);
// The arguments don't match. updateBoard() expects a grid and a container, but you're passing a boolean.

// That's completely understandable at this stage because you're still working out the design. However, before implementing the method, I'd settle on its contract.

// Ask yourself:

// Does updateBoard() receive a board's current state and its container?

// Does it retrieve the state itself from the controller?

// Does it receive an action result and determine which board needs refreshing?

// I'd favor having your rendering methods work with the board's current state, rather than making them responsible for interpreting game actions. Keep action coordination in the handler and board data retrieval in the controller.

// One practical issue: your current renderGrid() appends elements without clearing the existing container. If you intend to use it for full-board rerendering, repeated calls will duplicate the rows and cells. Decide whether the rendering method creates a board from scratch or updates an existing one, and make its behavior consistent with that responsibility.

// Also, renderGrid() currently ignores the cell data using row.forEach((_, colIndex) => ...). That's fine for constructing the initial grid structure, but you'll eventually need to use the state to assign the appropriate visual classes for ships, hits, and misses.

// 5. Be aware that an AI turn affects two boards
// This is particularly important for your proposed rendering approach.

// Suppose the human attacks the opponent's board, then the AI immediately attacks the human's board.

// The complete action changes two separate board states:

// The opponent's board reflects the human's attack.

// The human's board reflects the AI's attack.

// If your handler updates only the board that was clicked, the human's board won't reflect the AI's response unless you account for it separately.

// This is a good example of why the rendering strategy should follow the actual state changes, rather than assuming the clicked cell is the only thing that needs updating.

// You can still retain full-board rendering. You just need a clear way to determine which boards should be refreshed after a complete turn.

// 6. Your event handling could be a little more expressive
// Your event listeners are broadly fine. Event delegation is a good choice for a grid because you can attach one listener to the board instead of attaching a separate listener to every cell.

// Two small considerations:

// Identify which board was clicked. In the code shown, both listeners call handleBoardClicks(x, y) without passing the board identity. You mentioned that you have a method distinguishing the affected board, so make sure the clicked board is available wherever that decision is made.

// Consider closest('.cell') instead of matches('.cell'). Your current code works if the cell itself is always the event target. If you later put a child element inside a cell, such as an icon or marker, matches() won't find the cell from that child. closest() makes the handler more resilient.

// I wouldn't spend much time abstracting these listeners further until you have more interaction types. Their current structure is easy to understand.

// 7. A few smaller controller observations
// These aren't all urgent, but they're worth keeping in mind.

// startGame() repeats its readiness check
// You check the game phase and fleet readiness, then repeat both checks in a second if. The second condition is redundant after the first checks have passed.

// Simplifying this would make the method easier to read.

// getOpponent() could be more explicit
// Your method returns player two whenever the argument isn't player one. That works if it can only receive those two player instances. If that assumption is important, consider whether an unexpected argument should be handled explicitly instead of silently returning player one.

// getPlayerGrid() is a useful boundary
// I like that you're returning plain data instead of exposing the board's internal objects directly to the DOM layer.

// One subtlety: your returned ship properties are snapshots of the ship state, not live references. That is a good thing for presentation, but it means the view needs to retrieve fresh data whenever it rerenders.

// Your Elements class is reasonable
// Collecting DOM references in one place is a perfectly sensible choice. I wouldn't introduce more abstraction around it yet. Just remember that querySelector() can return null if an element is missing, so initialization errors can be easier to diagnose if you validate required elements.

// What I'd prioritize next
// I'd work through these in order:

// Fix action-result consistency. Make sure invalid actions, valid moves, and winning moves have predictable outcomes, particularly when the AI responds.

// Settle the rendering contract. Decide what updateBoard() receives and which layer retrieves the latest grid state.

// Implement board refreshes. Keep the initial full render and reuse the rendering approach for subsequent updates, making sure existing DOM elements are handled correctly.

// Verify turn and board coordination. Test human attacks, AI responses, invalid attacks, ship placement, and game completion.

// Refine responsibilities. Revisit the coupling between ship placement and game startup once the core interaction flow works.

// My overall assessment: your modules are reasonably structured for this stage of the project. You're already separating game logic from DOM manipulation, keeping DOM references centralized, and using event delegation. Those are worthwhile habits.

// The main thing I'd challenge you on is not whether to rerender 100 cells. It's whether your controller communicates a complete, unambiguous outcome for each action and whether your DOM Handler can reliably translate that outcome into the correct visual state.