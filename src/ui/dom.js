export class Elements {
    constructor () {
        this.gameBox   = document.querySelector('.game-box');
        this.allyBoard = document.querySelector('.ally-board');
        this.foeBoard  = document.querySelector('.foe-board');
        this.status    = document.querySelector('.status');

        this.startBtn  = document.querySelector('.start-btn');
        this.resetBtn  = document.querySelector('.reset-btn');
        this.aiBtn     = document.querySelector('.ai-btn');
        this.randomBtn = document.querySelector('.randomize-btn');
        this.rotateBtn = document.querySelector('.rotate-btn');
    }
}

export class Handler {
    constructor (controller) {
        this.controller = controller;
        this.elements = new Elements();
        
        this.init();
    }

    init () {
        this.bindButtonEvents();
        this.bindBoardEvents();
        this.renderAllyGrid();
        this.renderFoeGrid();
    }

    updateStatus (message) {
        this.elements.status.textContent = message;
    }

//status & button methods

    gameStart () {
        const gameStart = this.controller.startGame();

        if (!gameStart) {
            this.updateStatus('Deploy all ships');
            return;
        } else {
            this.updateStatus('Prepare for battle!');
        }
    }

    resetMethod () {
        //create new Game haha wut
    }

    aiToggle () {
        const aiToggle = this.controller.battleAi();

        if (!aiToggle) {
            this.updateStatus('Battle is already underway')
            return;
        } else {
            this.updateStatus('An artificial mind can be a formidable opponent');
        }
    }

    randomDeployment () {
        const randomDeployment = this.controller.createPlayerFleet();

        if (!randomDeployment) {
            this.updateStatus('The time for strategy has passed');
            return;
        } else {
            this.updateStatus('Fleet deployed');
        }
    }

    shipOrientation () {
        const setOrientation = this.controller.setOrientation();

        if (!setOrientation) {
            this.updateStatus('The time for strategy has passed');
        } else {
            this.updateStatus('Strategic placement confirmed');
        }
    }

    renderGrid (grid, gridContainer) {
        grid.forEach((row, rowIndex) => {
            const rowElement = document.createElement('div');

            row.forEach((_, colIndex) => {
                const cellElement = document.createElement('div');
                cellElement.classList.add('cell');

                cellElement.dataset.row = rowIndex;
                cellElement.dataset.col = colIndex;

                rowElement.append(cellElement);
            })
            gridContainer.append(rowElement);
        });
    }

    renderAllyGrid () {
        const allyGrid  = this.controller.getPlayerOneGrid();
        const allyBoard = this.elements.allyBoard;

        this.renderGrid(allyGrid, allyBoard);
    }

    renderFoeGrid () {
        const foeGrid  = this.controller.getPlayerTwoGrid();
        const foeBoard = this.elements.foeBoard;

        this.renderGrid(foeGrid, foeBoard);
    }

    updateAllyGrid () {
        
    }

    updateFoeGrid () {

    }

// events

    bindButtonEvents () {
        const start = this.elements.startBtn;
        start.addEventListener('click', () => {
            this.gameStart();
            console.log('this works');
        });

        const reset = this.elements.resetBtn;
        reset.addEventListener('click', () => {

        });

        const aiBtn = this.elements.aiBtn;
        aiBtn.addEventListener('click', () => {
            this.aiToggle();
        });

        const random = this.elements.randomBtn;
        random.addEventListener('click', () => {        
            this.randomDeployment();
        });

        const orientate = this.elements.rotateBtn;
        orientate.addEventListener('click', () => {
            this.shipOrientation();
        });
    }

    bindBoardEvents () {
        const allyBoard = this.elements.allyBoard;
        allyBoard.addEventListener('click', (e) => {
            const cell = e.target;

            if (cell.matches('.cell')) {
                const x = Number(cell.dataset.row);
                const y = Number(cell.dataset.col);

                this.handleBoardClicks (x, y);
            }
        });

        const foeBoard = this.elements.foeBoard;
        foeBoard.addEventListener('click', (e) => {
            const cell = e.target;

            if (cell.matches('.cell')) {
                const x = Number(cell.dataset.row);
                const y = Number(cell.dataset.col);

                this.handleBoardClicks (x, y);
            }
        });
    }

    handleBoardClicks (x, y) {
        this.controller.handleBoardClicks(x, y);
    }
}

// Step 1 — Fix the connection between your DOM cells and your click listener

// Before doing anything else, make sure every rendered cell is actually identifiable as a cell.

// You already have:

// data-row
// data-col

// That's good.

// You also have your listener looking for .cell.

// So your first task is simply:

// Make sure the cells created by renderGrid() have the .cell class.

// Then test it.

// When you click a cell, you should be able to confirm:

// "My Handler receives the correct row and column."

// Don't touch the game logic yet.

// Done when: clicking (3, 5) reliably gives your Handler 3, 5.

// Step 2 — Get one complete attack working through the Controller

// Now temporarily forget the DOM updating.

// Take this journey:

// Click enemy cell

// → Handler gets (row, col)

// → Handler calls Controller

// → Controller calls the appropriate Player/GameBoard method

// → GameBoard changes that cell

// Your goal here is to verify that the model actually changes correctly.

// For example:

// Before: enemy cell (3,5) is untouched
// Click (3,5)
// After: that cell is marked as hit/miss appropriately

// Use your console if necessary to inspect the state.

// Done when: one click produces the correct change in the actual GameBoard.

// Step 3 — Decide what the Controller gives back to the Handler

// This is the most important step.

// Right now your Handler does:

// controller.handleBoardClicks(x, y)

// …and then basically forgets about it.

// You need to establish a communication path back.

// Ask:

// "After the Controller handles this click, what does the Handler need to know?"

// For the moment, keep it extremely simple.

// The Handler needs to know:

// Which board changed?
// Which cell changed?
// What is the new state of that cell?

// You don't need to design some giant event system.

// Think about a single attack:

// Player clicked foe (3,5) → it was a miss.

// That's enough information for the Handler to update the visual representation of that cell.

// Done when: you can clearly describe what information travels from Controller → Handler after an attack.

// Step 4 — Build the "find this cell" part of your DOM Handler

// Now return to your DOM.

// You already have:

// data-row="3"
// data-col="5"

// So your next task is to create the DOM-side mechanism for saying:

// "Give me the DOM cell corresponding to row 3, column 5."

// Don't worry about hits, misses, ships, colours, or styling yet.

// Just solve:

// coordinates → correct DOM element

// You should be able to conceptually do:

// (3,5) → enemy board → corresponding <div>

// This is the foundation of your individual-cell updating.

// Done when: you can reliably identify the exact DOM cell that corresponds to a GameBoard coordinate.

// Step 5 — Make that one cell visually reflect its new state

// Now you finally connect everything.

// Your complete flow becomes:

// Player clicks enemy cell

// ↓

// Handler gets coordinates

// ↓

// Controller performs attack

// ↓

// GameBoard changes

// ↓

// Controller communicates the result/state

// ↓

// Handler identifies that DOM cell

// ↓

// Handler changes its visual state

// And that's your first proper game-state → DOM update loop.

// Start with only hit vs miss.

// Don't worry about:

// sunk ships
// AI
// turns
// game over
// reset
// fancy animations
// status messages

// Just get:

// click → attack → hit/miss → one cell changes visually

// working perfectly.

// Your immediate roadmap

// So for now, literally put everything else out of your head:

// 1. Make .cell and the click listener match

// ⬇️

// 2. Verify one click actually changes GameBoard state

// ⬇️

// 3. Decide what information Controller returns to Handler

// ⬇️

// 4. Make coordinates locate the correct DOM cell

// ⬇️

// 5. Make that cell visually represent hit/miss

// Once Step 5 works, stop.

// That's your next milestone.

// Then we can take the next five steps from that point, probably starting with ship placement and making the deployment phase update the ally board.

// The key is: don't build the whole UI architecture in your head right now. You're at the point where you should get one complete vertical slice working — one click all the way from the DOM to GameBoard and back to the DOM.

// *****************************************************


// The main thing I’d change in your thinking is this:

// The DOM should not decide what changed. The Controller/GameState should tell the DOM what changed, and the DOM should reflect that change.

// You’re very close to a clean MVC-ish flow.

// Where you are now

// Your current architecture is essentially:

// User clicks cell
// → Handler gets coordinates
// → Controller receives coordinates
// → Controller decides what the click means
// → GameBoard changes
// → Controller exposes the resulting state
// → Handler updates the DOM

// That is a good direction.

// I would not make the DOM re-render the whole board after every shot. You have a persistent 12×12 grid already sitting in the DOM, so destroying and rebuilding 144 cells every time someone fires is unnecessary.

// Instead:

// Game state changes
// → identify affected coordinate(s)
// → update that DOM cell
// → leave everything else alone.

// Your next steps, in order
// 1. Finish handleBoardClicks() conceptually

// Before worrying about DOM updates, make sure the Controller can correctly answer:

// "What should happen when the player clicks (x, y)?"

// You already have the two major modes:

// strategy → ship placement
// playing → attacking

// But there's an important issue in the code you showed:

// Your gameState is an object, but you're comparing it as though it were a string.

// You're currently thinking along the lines of:

// gameState === "strategy"

// But your actual state is:

// gameState.status === "strategy"

// So fix that conceptual mismatch first.

// This is important because everything downstream depends on the Controller correctly determining what action a click represents.

// 2. Make the Controller's actions produce a meaningful result

// This is probably your real next architectural step.

// Right now your Handler calls:

// this.controller.handleBoardClicks(x, y)

// But then the Handler doesn't know what happened.

// Imagine the player clicks an enemy cell.

// Several things could happen:

// It was already attacked → nothing changes.
// It was an empty cell → miss.
// It contained a ship → hit.
// It was the final hit on a ship → ship becomes sunk.
// It was the final ship → game ends.
// The turn changes.

// The DOM shouldn't have to figure any of this out.

// The Controller should be able to say, conceptually:

// "That click resulted in a hit at row 4, column 7."

// or

// "That click resulted in a miss at row 4, column 7."

// or potentially:

// "That click was invalid; nothing changed."

// This is the bridge you're currently missing between your game logic and your DOM.

// 3. Decide what information the View needs

// This is where I'd encourage you not to overcomplicate things.

// Your View doesn't need the entire GameBoard after every click.

// It mostly needs:

// For a shot
// Which board changed?
// Which row?
// Which column?
// What is now visible at that cell?

// For example, conceptually:

// Foe board
// → row 4
// → column 7
// → result: hit

// Then your Handler can find the corresponding DOM element and change its appearance.

// Your existing:

// data-row
// data-col

// are therefore exactly the sort of thing you want.

// 4. Give your cells a consistent visual identity

// There's one thing in your current renderGrid() that you'll need to reconcile.

// You're checking:

// cell.matches('.cell')

// in your board listener.

// But the cells you're creating don't currently appear to receive a .cell class.

// That's something to fix before continuing.

// Conceptually, every DOM cell should have:

// a predictable class identifying it as a cell
// its row
// its column

// You've already got the coordinates.

// So your DOM structure should give you a very simple relationship:

// Game state coordinate (4, 7)

// ↕

// DOM cell [row=4][col=7]

// That's the key relationship your update methods will rely upon.

// 5. Then build your individual-cell update methods

// Now we get to the thing you originally asked about.

// You have:

// updateAllyGrid()
// updateFoeGrid()

// I'd actually pause before deciding exactly what those methods should do.

// Ask yourself:

// "Does this method need to update an entire grid, or does it need to update a particular cell?"

// Your current naming suggests whole-grid updates.

// But your intended architecture is actually:

// "Update this particular cell."

// So I'd think in terms of a smaller responsibility:

// Find the DOM cell at (row, col) → apply the visual state it should have.

// Then your board-specific methods can use that.

// You don't necessarily need a completely separate system for every possible game event.

// 6. Don't let the DOM inspect your domain objects

// This is especially important with your getPlayerGrid() method.

// I actually like what you're doing here:

// You aren't handing your raw GameBoard / Ship objects to the DOM.

// You're creating a view model containing things such as:

// hit
// miss
// limited ship information

// That's a good separation.

// I'd continue that philosophy.

// The DOM should be able to ask:

// "What should this cell look like?"

// without knowing:

// how Ship works
// how GameBoard.receiveAttack() works
// how ship HP works
// how sinking works
// how the fleet is stored

// Those belong to your model/game logic.

// 7. Decide what the player is actually allowed to see

// This is particularly important for your foe board.

// Your underlying enemy board might know:

// (4,7) contains a ship.

// But before that cell has been attacked, the player's DOM shouldn't know that.

// So your view model eventually needs to distinguish between:

// Ally board

// The player can see:

// their ships
// hits
// misses
// sunk ships
// Foe board

// The player should see:

// unknown cells
// hits
// misses
// perhaps sunk ships

// But not untouched enemy ships.

// This is one of the reasons your view-model approach is useful.

// The Controller can expose information appropriate for the UI rather than simply exposing the raw board.

// 8. Handle ship placement separately from attacking

// This is the next big area I'd tackle after your cell updating works.

// During "strategy" mode, clicking an ally cell means something completely different from clicking a foe cell during "playing".

// You therefore have two distinct interactions:

// Deployment phase

// Click ally board:

// coordinate
// → Controller
// → attempt to place ship
// → GameBoard changes
// → update affected ally cells

// Battle phase

// Click foe board:

// coordinate
// → Controller
// → attack
// → GameBoard changes
// → update affected foe cell
// → possibly update status
// → possibly switch turn
// → possibly trigger AI

// I'd keep these conceptual flows separate rather than trying to make one giant "cell update" system understand all game mechanics.

// 9. Then deal with the AI

// Once human-vs-human interaction works, I'd move to:

// Player attacks
// → resolve attack
// → update foe DOM
// → determine whether game continues
// → AI takes turn
// → AI chooses coordinate
// → Controller resolves AI attack
// → update ally DOM
// → determine whether game continues

// Notice something important here:

// The AI should not manipulate the DOM.

// The AI belongs in your game logic.

// The Controller orchestrates it.

// The Handler renders the result.

// That separation will save you a lot of pain later.

// 10. Add game-over handling last

// Once attacks, turns and AI work, then introduce:

// winner detection
// disabling further attacks
// final status message
// perhaps visual indication of the winning/losing board
// reset

// Don't try to solve reset and game-over while you're still establishing the basic attack → DOM-update cycle.

// I'd structure your remaining work roughly like this

// You're currently around here:

// DOM rendering
//       ↓
// DOM listeners
//       ↓
// coordinates
//       ↓
// Controller
//       ↓
// GameBoard

// Your next milestone is:

// DOM click
//     ↓
// coordinates
//     ↓
// Controller
//     ↓
// game action
//     ↓
// GameBoard changes
//     ↓
// Controller knows what changed
//     ↓
// Handler receives result
//     ↓
// find corresponding DOM cell
//     ↓
// change that cell

// Then build outward:

// Individual cell updates
//         ↓
// Ship placement
//         ↓
// Attack / hit / miss
//         ↓
// Turns
//         ↓
// AI
//         ↓
// Game over
//         ↓
// Reset
// One thing I'd strongly recommend

// Don't build updateAllyGrid() and updateFoeGrid() yet.

// First figure out this question:

// "After controller.handleBoardClicks(x, y) finishes, what information does the Handler need in order to update the UI correctly?"

// That's the architectural question sitting immediately in front of you.

// Once you've answered that, the actual DOM update becomes quite straightforward.

// And yes: your idea of updating only the affected cell rather than re-rendering the entire board is the approach I'd recommend for this project. Your existing data-row / data-col setup is already pointing you in that direction.

// If you want, your next exercise should be to design the information flow for one single scenario — "player clicks an enemy cell and hits a ship" — without writing any code yet. That's the perfect next step before you implement anything.