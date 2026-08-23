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

// One thing I'd change from my previous suggestion is not to turn ship into a boolean unless that's actually what your UI needs. Your Ship class has meaningful state (length, hit, sunk), so the Controller should decide what subset of that state the DOM needs.

// Your current dependency structure

// You effectively have:

// Ship → GameBoard → Player → Controller → Handler → Elements/DOM

// That's a nice one-way dependency chain.

// Your Handler currently receives the Controller:

// Handler
//   ↓
// Controller
//   ↓
// Player
//   ↓
// GameBoard
//   ↓
// Ship

// That's okay because the Handler isn't being given those objects directly. It communicates through the Controller.

// Where I'd put the grid conversion

// I'd keep the actual GameBoard completely unaware of the DOM.

// The Controller can have a method whose job is essentially:

// "Give the UI a representation of this player's board."

// For your particular structure, I'd probably return something like:

// getPlayerGrid(player) {
//     return player.board.grid.map(row =>
//         row.map(cell => ({
//             hit: cell.hit,
//             miss: cell.miss,
//             ship: cell.ship
//                 ? {
//                     length: cell.ship.length,
//                     hit: cell.ship.hit,
//                     sunk: cell.ship.sunk
//                 }
//                 : null
//         }))
//     );
// }

// Now notice what's happening.

// The DOM gets:

// {
//     hit: false,
//     miss: false,
//     ship: {
//         length: 5,
//         hit: 2,
//         sunk: false
//     }
// }

// rather than:

// {
//     hit: false,
//     miss: false,
//     ship: Ship instance
// }

// That's a significant distinction.

// The first is plain data.

// The second is an actual domain object.

// So if your Handler does something like:

// const grid = this.game.getPlayerGrid(player);

// it receives data it can render, but it doesn't receive your actual Ship instances.

// Why this is particularly useful with your Ship class

// Your Ship contains behaviour:

// isSunk()
// isHit()

// The DOM shouldn't be able to do something like "hit this ship" by calling a method on your Ship.

// That's game logic.

// Instead, the Controller/GameBoard handles the actual hit, updates the Ship, and then the Controller can give the DOM an updated representation.

// So you get:

// User clicks cell

// → Handler tells Controller what cell was clicked

// → Controller/GameBoard handles the game logic

// → Ship is updated

// → Controller provides updated board data

// → Handler renders it

// That's a really clean separation.

// One thing I'd keep an eye on

// Your Handler constructor parameter is called Game, but you're actually passing a Controller:

// const controller = new Controller();
// const handler = new Handler(controller);

// I'd call it controller rather than Game.

// It's a small thing, but names become increasingly valuable as your project grows. Your Handler isn't communicating with "the game" generically; it's communicating with the Controller.

// So overall, I'd say your architecture is heading in a good direction:

// Game logic

// Ship → GameBoard → Player → Controller

// Presentation

// Controller → Handler → Elements

// And the Controller is the boundary where you transform your internal game state into plain data that the UI can safely consume.