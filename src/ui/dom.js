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
        
        this.init();
    }

    updateStatus (message) {
        this.elements.status.textContent = message;
    }

//status & button methods

    gameStart () {
        const gameStart = this.game.startGame();

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
        const aiToggle = this.game.battleAi();

        if (!aiToggle) {
            this.updateStatus('Battle is already underway')
            return;
        } else {
            this.updateStatus('An artificial mind can be a formidable opponent');
        }
    }

    randomDeployment () {
        const randomDeployment = this.game.createPlayerFleet();

        if (!randomDeployment) {
            this.updateStatus('The time for strategy has passed');
            return;
        } else {
            this.updateStatus('Fleet deployed');
        }
    }

    shipOrientation () {
        const setOrientation = this.game.setOrientation();

        if (!setOrientation) {
            this.updateStatus('The time for strategy has passed');
        } else {
            this.updateStatus('Strategic placement confirmed');
        }
    }

//board methods

    placeShip (x, y) {
        const setShip = this.game.setShip(x, y);

        if (!setShip) {
            this.updateStatus('Ship must be placed on valid location inside board');
        } else {
            this.updateStatus('Deploy all ships');
        }
    }

    playTurn (x, y) {
        const attack = this.game.playTurn(x, y);
        if (!attack) return;
    }

// events

    init () {
        this.bindButtonEvents();
        this.bindBoardEvents(x, y)
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

    bindBoardEvents (x, y) {
        const allyBoard = this.elements.allyBoard;
        allyBoard.addEventListener('click', () => {
            this.playTurn(x, y);
        });

        const foeBoard = this.elements.foeBoard;
        foeBoard.addEventListener('click', () => {
            this.placeShip(x, y);
        });
    }
}

// *************************************************

// 1. Your DOM class

// The DOM class receives a board and turns its 2D grid into visual cells:

// export class DOM {
//     constructor () {
//         this.playerBoard = document.querySelector("#player-board");
//         this.enemyBoard = document.querySelector("#enemy-board");
//     }

//     renderBoard (board, container) {
//         container.replaceChildren();

//         board.grid.forEach((row, rowIndex) => {
//             row.forEach((cell, colIndex) => {
//                 const cellElement = document.createElement("div");

//                 cellElement.classList.add("cell");

//                 cellElement.dataset.row = rowIndex;
//                 cellElement.dataset.col = colIndex;

//                 container.appendChild(cellElement);
//             });
//         });
//     }

//     renderPlayerBoard (board) {
//         this.renderBoard(board, this.playerBoard);
//     }

//     renderEnemyBoard (board) {
//         this.renderBoard(board, this.enemyBoard);
//     }
// }

// The important part is this:

// GameBoard.grid
//        ↓
//      rows
//        ↓
//      cells
//        ↓
// DOM elements

// Your grid already contains 12 rows containing 12 objects, so the DOM just walks through it and creates one element for each object.

// 2. Your Controller

// Your Controller already creates the Players, so you just need your DOM instance available and then render their boards.

// Conceptually:

// import { Player } from "../player/Player.js";
// import { Computer } from "../computer/computer.js";
// import { DOM } from "../dom/DOM.js";

// export class Controller {
//     constructor () {
//         this.player1 = new Player();
//         this.player2 = new Player();
//         this.computer = new Computer();

//         this.dom = new DOM();

//         this.gameState = {
//             status: "strategy",
//             turn: this.player1,
//             enableAi: false,
//             winner: null
//         };

//         this.initialiseGame();
//     }

//     initialiseGame () {
//         this.dom.renderPlayerBoard(this.player1.board);
//         this.dom.renderEnemyBoard(this.player2.board);
//     }
// }

// Now notice the chain:

//                  Controller
//                  /        \
//                 /          \
//            player1       player2
//               ↓              ↓
//             board           board
//               ↓              ↓
//             grid            grid
//               ↓              ↓
//              DOM            DOM

// The Controller is the bridge.

// 3. Then your entry point

// Somewhere you have your application entry point — perhaps index.js, main.js, etc.

// That's where I'd initialise the Controller after the DOM has loaded.

// For example:

// import { Controller } from "./controller/Controller.js";

// document.addEventListener("DOMContentLoaded", () => {
//     new Controller();
// });

// Now the complete startup sequence is:

// DOMContentLoaded
//        ↓
// new Controller()
//        ↓
// new Player()
//        ↓
// new GameBoard()
//        ↓
// GameBoard creates 12 × 12 grid
//        ↓
// Controller.initialiseGame()
//        ↓
// DOM.renderPlayerBoard(player1.board)
//        ↓
// DOM creates 144 cells

// And you have your visual board.

// 4. Your HTML only needs the containers

// You don't need to manually create any cells.

// Something like:

// <div id="player-board"></div>

// <div id="enemy-board"></div>

// The JavaScript creates the 144 children inside each one.

// Then CSS can turn the container into your 12 × 12 grid.

// For example, conceptually:

// #player-board,
// #enemy-board {
//     display: grid;
//     grid-template-columns: repeat(12, 1fr);
// }

// And your .cell gives each square its appearance.

// 5. Now you have coordinates attached to every cell

// This part is particularly useful for Battleship:

// cellElement.dataset.row = rowIndex;
// cellElement.dataset.col = colIndex;

// So the DOM visually contains something equivalent to:

// cell → row 0, col 0
// cell → row 0, col 1
// cell → row 0, col 2
// ...
// cell → row 11, col 11

// When a player eventually clicks a cell, your DOM can retrieve those coordinates and tell the Controller:

// "The player clicked 4, 7."

// The Controller then decides what that means.

// The DOM doesn't need to know whether (4, 7) contains a ship, whether the attack is valid, whether the ship is sunk, etc.

// One thing I'd change depending on your exact design

// If your DOM is already constructed elsewhere and the Controller is supposed to be the only thing the DOM communicates with, I'd probably make the relationship slightly more explicit:

// Controller
//     │
//     ├── player1.board ──────┐
//     │                       ↓
//     │                      DOM
//     │                       ↑
//     └── player2.board ──────┘

// So the DOM is essentially a renderer. It doesn't own the board and doesn't know about Players.

// That is a very clean architecture for your project.

// Also, you don't actually need to pass the entire GameBoard if you don't want to. You could pass board.grid, but I personally like renderBoard(board) here because the Controller is explicitly saying "render this board", while the DOM can then access whatever board information it needs to render it.