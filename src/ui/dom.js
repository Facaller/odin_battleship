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

//board methods
//Remove these params. Create method that captures click coordinates.
//Use that for controller methods instead
    renderGrid (grid, gridContainer) {
        grid.forEach((row, rowIndex) => {
            const rowElement = document.createElement('div');

            row.forEach((cell, colIndex) => {
                const cellElement = document.createElement('div');

                cellElement.dataset.row = rowIndex;
                cellElement.dataset.col = colIndex;

                rowElement.append(cellElement);
            })
            gridContainer.append(rowElement);
        });
    }

    placeShip () {
        const setShip = this.controller.setShip(x, y);

        if (!setShip) {
            this.updateStatus('Ship must be placed on valid location inside board');
        } else {
            this.updateStatus('Deploy all ships');
        }
    }

    playTurn () {
        const attack = this.controller.playTurn(x, y);
        if (!attack) return;
    }

// events

    init () {
        this.bindButtonEvents();
        this.bindBoardEvents()
    }

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
//this is incorrect because the Handler should only know about clicks.
//The controller decides what that click means (playTurn or placeShip)
    bindBoardEvents () {
        const allyBoard = this.elements.allyBoard;
        allyBoard.addEventListener('click', (e) => {
            const cell = e.target;

            if (cell.matches('.cell')) {
                const x = Number(cell.dataset.row);
                const y = Number(cell.dataset.col);
            }
        });

        const foeBoard = this.elements.foeBoard;
        foeBoard.addEventListener('click', (e) => {
            const cell = e.target;

            if (cell.matches('.cell')) {
                const x = Number(cell.dataset.row);
                const y = Number(cell.dataset.col);
            }
        });
    }
}

// Yes — you've got the architecture right. There is just one small distinction I'd make: the Handler method doesn't really need to use the x and y beyond extracting/passing them along.

// Think of the flow as:

// DOM click
//    ↓
// Handler listener
//    ↓
// Handler extracts x/y
//    ↓
// Handler calls Controller method with x/y
//    ↓
// Controller checks game state
//    ↓
// Controller decides:
//    ├── placeShip(x, y)
//    └── attack(x, y)

// So yes, you'd have roughly one additional method in each class.

// In your Handler

// Your listener could become:

// bindBoardEvents () {
//     const allyBoard = this.elements.allyBoard;

//     allyBoard.addEventListener('click', (e) => {
//         const cell = e.target;

//         if (cell.tagName === 'DIV') {
//             const x = Number(cell.dataset.row);
//             const y = Number(cell.dataset.col);

//             this.handleBoardClick(x, y);
//         }
//     });

//     // ...
// }

// And then:

// handleBoardClick(x, y) {
//     this.controller.handleBoardClick(x, y);
// }

// The important thing here is that the Handler doesn't say placeShip or attack.

// It just says:

// "Controller, someone clicked (x, y)."

// Then in your Controller

// You have something like:

// handleBoardClick(x, y) {
//     if (this.gameState === 'placing') {
//         this.placeShip(x, y);
//     } else if (this.gameState === 'playing') {
//         this.attack(x, y);
//     }
// }

// That's where the decision belongs.

// One thing I'd consider

// You don't necessarily need the extra Handler method:

// handleBoardClick(x, y) {
//     this.controller.handleBoardClick(x, y);
// }

// You could have the listener directly call the Controller:

// allyBoard.addEventListener('click', (e) => {
//     const cell = e.target;

//     if (cell.tagName === 'DIV') {
//         const x = Number(cell.dataset.row);
//         const y = Number(cell.dataset.col);

//         this.controller.handleBoardClick(x, y);
//     }
// });

// But if you're intentionally designing your Handler as a layer that handles DOM events and communicates those events to the Controller, having the Handler method is perfectly reasonable and can make the responsibilities clearer.

// *****************************************************


// Step 1 — Establish what the Handler's responsibility is

// You've already identified this yourself:

// "The Handler should only know about clicks."

// That's a good rule for this project.

// Think of the Handler as the translator between:

// DOM event → Controller instruction

// So the Handler should know things like:

// A button was clicked.
// A board cell was clicked.
// Which board was clicked.
// Which row/column was clicked.

// But it shouldn't decide:

// whether a ship can be placed
// whether it's the player's turn
// whether an attack is valid
// whether the game has started
// whether a ship is sunk

// Those belong elsewhere.

// So before writing more code, I'd make yourself this little rule:

// Handler detects what the user interacted with. Controller decides what that interaction means.

// That's your architectural compass.

// Step 2 — Finish renderGrid() conceptually

// You're actually very close here.

// Your renderGrid() needs to accomplish two things:

// A. Create the visual grid

// You're doing that already.

// B. Give each cell enough identity for a click

// You're also doing that:

// rowIndex
// colIndex

// You've correctly realized you don't need:

// rowElement.dataset.row

// because the cell itself knows its coordinates.

// Now ask yourself:

// "When a user clicks a cell, what information will I need to give the Controller?"

// You should be able to answer:

// row
// column

// And possibly:

// which board?

// That last question is important because you have two boards.

// Step 3 — Decide how the Handler identifies the clicked cell

// This is the next thing I'd work on.

// Your event listener currently looks like:

// allyBoard.addEventListener('click', () => {
    
// });

// Don't worry about calling the Controller yet.

// First, make the Handler capable of answering:

// "Which cell did the user click?"

// Remember that the event listener receives an event object.

// So your next exercise should be:

// Receive the event.
// Inspect the element that was clicked.
// Determine whether that element is a cell.
// Get its data-row.
// Get its data-col.
// Convert them into numbers if necessary.

// Don't worry about placeShip() or playTurn() yet.

// Just get to the point where you can click a cell and log something like:

// row: 4
// col: 7

// That's your next milestone.

// Step 4 — Think carefully about target vs currentTarget

// This is an important DOM concept for your particular setup.

// You have:

// foeBoard
//    ↓
// rowElement
//    ↓
// cellElement

// Your listener is attached to the board, not each individual cell.

// So when you click:

// cellElement

// the event bubbles upward to:

// foeBoard

// This is called event delegation, and it's actually a nice approach for your grid.

// Your Handler needs to distinguish:

// "The board received the event"

// from:

// "This particular cell was clicked."

// That's where the event's target and currentTarget concepts become important.

// I would spend a little time understanding those before proceeding. You don't need to memorize them—just understand what each one represents in your particular DOM tree.

// Step 5 — Don't use cell in the click Handler

// This connects to your previous question.

// Your renderGrid() has:

// row.forEach((cell, colIndex) => {

// That cell belongs to your view model.

// Your click handler deals with a DOM element.

// Those are two different things.

// Think:

// renderGrid
//     ↓
// cell object
//     ↓
// creates
//     ↓
// cellElement
//     ↓
// user clicks
//     ↓
// event
//     ↓
// Handler

// You don't need to somehow carry the cell object through the event.

// Your Handler can identify:

// row + col

// and your Controller/GameBoard can use those coordinates to determine what the actual game state is.

// This is another reason I wouldn't put the Ship snapshot into dataset.

// Step 6 — Decide what the two board listeners actually mean

// You have:

// allyBoard.addEventListener(...)
// foeBoard.addEventListener(...)

// This is where your comment is particularly useful:

// "The controller decides what that click means (playTurn or placeShip)"

// Exactly.

// Ask yourself:

// Ally board click

// During the strategy/deployment phase:

// click ally cell
//         ↓
// Handler gets coordinates
//         ↓
// Controller is told about the coordinates
//         ↓
// Controller decides whether this means placement
// Foe board click

// During battle:

// click foe cell
//         ↓
// Handler gets coordinates
//         ↓
// Controller is told about the coordinates
//         ↓
// Controller decides whether this means attack

// Notice that the Handler doesn't need to contain:

// if (gameState.status === ...)

// That's Controller territory.

// Step 7 — Your placeShip() and playTurn() methods need reconsideration

// Right now you have:

// placeShip () {
//     const setShip = this.controller.setShip(x, y);

// and:

// playTurn () {
//     const attack = this.controller.playTurn(x, y);

// Obviously x and y don't exist yet.

// But don't immediately fix them by making the Handler somehow magically know x and y.

// Instead, go back to Step 3.

// Your event handler should obtain:

// row
// col

// Then ask:

// "Who should receive those coordinates?"

// The answer should lead you toward how these methods should be structured.

// You might also notice that you don't necessarily need separate Handler methods called placeShip() and playTurn() at all.

// That's something I'd deliberately leave undecided until you've worked through the event flow.

// Your own comment is pointing you toward this realization.

// Step 8 — Don't worry about resetMethod() yet

// I'd put this aside.

// You currently have:

// resetMethod () {
//     //create new Game haha wut
// }

// That's a separate architectural question.

// Eventually you'll need to decide whether resetting means:

// replace Controller state

// or:

// reset existing objects

// But that isn't blocking your board interaction.

// Don't let it distract you.

// Step 9 — Don't add Ship data to the DOM yet

// This is the thing I'd specifically not do next.

// You already have:

// getPlayerGrid()

// which produces:

// cell
//  ├── hit
//  ├── miss
//  └── ship
//       ├── length
//       ├── hit
//       └── sunk

// That's your view model.

// Your DOM cell only needs enough information to identify itself and visually represent whatever state you've decided to show.

// So for now, keep these concepts separate:

// GAME STATE
// GameBoard.grid
//     ↓
// VIEW MODEL
// getPlayerGrid()
//     ↓
// DOM
// cellElement
//     ↓
// USER EVENT
// click
//     ↓
// HANDLER
// row + col
//     ↓
// CONTROLLER
// what does this click mean?

// That's the architecture I'd try to hold in your head.

// Step 10 — Your immediate coding exercise

// If I were mentoring you through this, I wouldn't ask you to implement another game feature yet.

// I'd give you this one task:

// Make this work:

// When I click a cell on either board, the Handler can identify the row and column of the clicked cell.

// Nothing more.

// Don't call the Controller yet.

// Don't place a ship.

// Don't attack.

// Don't update the game.

// Just prove that you can go:

// click
//  ↓
// clicked element
//  ↓
// row
//  ↓
// column

// Once that works, come back to the Controller.

// Then we'll trace:

// clicked cell
//      ↓
// coordinates
//      ↓
// Controller
//      ↓
// what should happen?

// That will naturally expose what your next methods should look like.

// For your project right now, that's:

// User clicks cell
//        ↓
// Handler identifies cell
//        ↓
// row + col

// Then:

// row + col
//        ↓
// Controller receives them
//        ↓
// Controller determines action

// Then:

// action
//        ↓
// GameBoard changes state

// Then:

// new state
//        ↓
// view model
//        ↓
// DOM updates