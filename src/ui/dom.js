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
    constructor (Game) {
        this.game = Game;
        this.elements = new Elements();
    }

    updateStatus (message) {
        this.status.textContent = message;
    }

    checkGameStart () {
        if (!this.game.startGame()) {
            this.updateStatus('Deploy all ships');
            return;
        }
        this.game.startGame();
        this.updateStatus('Prepare for battle!');
    }

    resetMethod () {
        //create new Game haha wut
    }

    aiToggle () {
        if (!this.game.battleAi()) {
            this.updateStatus('Battle is already underway')
            return;
        }

        this.game.battleAi();
        this.updateStatus('An artificial mind can be a formidable opponent');
    }

    //button events
    handleStartGame = () => {
        const start = this.elements.startBtn;
        start.addEventListener('click', (event) => {
            event.preventDefault();
            this.checkGameStart();
        });
    }

    handleReset = () => {
        const reset = this.elements.resetBtn;
        reset.addEventListener('click', (event) => {
            event.preventDefault();

        });
    }

    handleAiToggle () {
        const aiBtn = this.elements.aiBtn;
        aiBtn.addEventListener('click', (event) => {
            event.preventDefault();

        });
    }
}

// Your Handler class seems like it's going to be the bridge between your game logic and the UI. That's a good responsibility for it. The important thing is to keep the separation clear:

// Game should know nothing about HTML or the DOM.
// Handler should ask the game for information and update the page.
// Elements should probably just keep references to DOM nodes (boards, buttons, messages, etc.) so you aren't repeatedly querying the document.

// So your architecture is looking something like:

// Game
//    ↑
// Handler
//    ↓
// Elements (DOM references)

// That's a pretty common approach.

// One thing to consider

// Ask yourself what Elements is actually responsible for.

// For example, is it:

// just storing references to DOM elements?
// creating elements?
// both?

// Many people make the mistake of turning it into a second DOM handler. If Handler is already responsible for updating the interface, then Elements can simply be a convenient place to store references.

// About creating the grid

// Your Gameboard.grid is perfect as a data structure.

// Now you need a visual representation.

// Think of it as two separate grids:

// Gameboard.grid

// holds

// [
//   [{hit:false, ship:null}, ...],
//   ...
// ]

// while the DOM contains

// <div class="board">
//     <div class="cell"></div>
//     <div class="cell"></div>
//     ...
// </div>

// The DOM cells don't need to store game state—they just represent it.

// How to build the HTML grid

// Don't write 576 <div>s by hand.

// Instead, your handler should:

// Create one container element for the board.
// Loop through every row.
// Loop through every column.
// Create one cell element for each coordinate.
// Give each cell enough information to know which coordinate it represents.
// Append it to the board.

// Mentally:

// for each row
//     for each column
//         create cell
//         tell it "I'm row 3 column 8"
//         add to board

// After 24 × 24 iterations you'll have 576 cells.

// CSS Grid

// CSS Grid is almost certainly the easiest layout.

// Your board container becomes a grid with 24 columns.

// Then every child automatically occupies one square.

// You don't need nested rows in the HTML unless you want them.

// The structure can simply be

// board
//  ├── cell
//  ├── cell
//  ├── cell
//  ├── ...
//  └── cell

// CSS handles wrapping every 24 cells onto a new row.

// Connecting the DOM to the game

// One thing you'll need is a way to know which square the user clicked.

// Each cell should somehow know:

// row
// column

// Then when someone clicks:

// User clicks cell

// ↓

// Handler reads row/column

// ↓

// Handler tells Game:
// "Attack row 5, column 17."

// ↓

// Game updates its grid

// ↓

// Handler redraws that square

// That's the flow you're aiming for.

// A question for you

// Your game board is 24 × 24, which is much larger than the traditional Battleship board (usually 10 × 10).

// Is 24 × 24 intentional because you're making your own variant, or is it just a temporary value while you're building things?