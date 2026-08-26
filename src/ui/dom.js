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
        
        this.init(x, y);
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

    }

    placeShip (x, y) {
        const setShip = this.controller.setShip(x, y);

        if (!setShip) {
            this.updateStatus('Ship must be placed on valid location inside board');
        } else {
            this.updateStatus('Deploy all ships');
        }
    }

    playTurn (x, y) {
        const attack = this.controller.playTurn(x, y);
        if (!attack) return;
    }

// events

    init (x, y) {
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
//this is incorrect because the Handler should only know about clicks.
//The controller decides what that click means (playTurn or placeShip)
    bindBoardEvents (x, y) {
        const allyBoard = this.elements.allyBoard;
        allyBoard.addEventListener('click', () => {
            this.playTurn(x, y);
        });

        const foeBoard = this.elements.foeBoard;
        foeBoard.addEventListener('click', () => {
            this.playTurn(x, y);
        });
    }
}

// *************************************************

// /Step 1 — Establish who owns what

// Your architecture is currently roughly:

// Game model:

// Ship → GameBoard → Player → Controller

// UI:

// Controller → Handler → Elements → DOM

// That's a good separation.

// The Controller knows about:

// player 1
// player 2
// computer
// whose turn it is
// game status
// winner
// game actions

// The Handler knows about:

// buttons
// board DOM elements
// displaying status
// receiving clicks
// asking the Controller to perform actions
// rendering information supplied by the Controller

// The Handler should not need to know that a cell contains a Ship instance.

// Step 2 — Decide what getPlayerGrid() actually means

// This is the first thing I'd change conceptually.

// Currently your getPlayerGrid() means:

// "Give me the grid belonging to whoever's turn it is."

// That's not necessarily what you want for rendering.

// Imagine you're in a game where it's Player 2's turn.

// You still need to display:

// Player 1's board on the left
// Player 2's board on the right

// The UI shouldn't have to think:

// "Whose turn is it? Therefore which board should I ask for?"

// Those are separate concerns.

// Your Controller already has player1 and player2, so I'd think in terms of:

// my/player board
// opponent board

// rather than "current turn board."

// Step 3 — Decide what the Controller should expose

// Your Handler should be able to ask the Controller questions such as:

// "Give me the board data I should render for the player."

// and:

// "Give me the board data I should render for the opponent."

// The important part is that the Handler doesn't need to reach inside the Player or GameBoard itself.

// So conceptually:

// Handler asks Controller

// → Controller finds the appropriate Player

// → Controller gets that player's actual GameBoard

// → Controller converts the GameBoard into plain data

// → Controller gives that plain data back

// The Handler never needs to know that this happened.

// Step 4 — Your existing grid-copy method is the right mechanism

// Your current method is already doing the important transformation.

// The actual game has something conceptually like:

// Player → GameBoard → grid → Cell → Ship instance

// But the UI receives:

// grid → cell data → ship data

// That's exactly the boundary you want.

// The Controller is essentially saying:

// "I won't give the Handler my game objects. I'll give it a snapshot of the information it needs to draw the screen."

// That's a very good pattern.

// Step 5 — Think of the returned grid as a "view model"

// You don't necessarily need to use that terminology, but it's useful to understand what you're doing.

// Your actual GameBoard is your game model.

// Your copied grid is a representation of that model for the UI.

// So you have:

// GameBoard

// Contains actual objects and game logic.

// ↓

// Controller

// Converts that into UI-friendly data.

// ↓

// Handler

// Doesn't care how the game works. It only cares what needs to be displayed.

// This means your Handler can look at a cell and ask:

// Was this cell hit?
// Was this cell a miss?
// Does this cell contain a ship?
// If so, is that ship sunk?

// And that's it.

// Step 6 — Decide what your renderGrid method should be responsible for

// Your idea from your previous message was exactly right:

// one parameter for the grid and another for the DOM element

// I'd keep that responsibility very narrow.

// Think of the method as:

// "Here is a grid. Here is the DOM container. Draw the grid inside that container."

// It should not:

// retrieve the Player
// retrieve the GameBoard
// determine whose turn it is
// perform attacks
// place ships
// inspect Ship methods
// modify game state

// It should only interpret the plain data it receives and create/update DOM elements.

// Step 7 — Your Handler can then have a higher-level board-rendering method

// This is an important distinction.

// You probably want two levels of responsibility in your Handler.

// Higher level

// Something conceptually like:

// "Render both boards."

// This method asks the Controller for the appropriate board data.

// Then it gives each grid to the appropriate DOM element.

// Lower level

// Your renderGrid method says:

// "Take this particular grid and render it into this particular element."

// So the flow becomes:

// Handler: render boards

// ↓

// ask Controller for player grid

// ask Controller for opponent grid

// ↓

// Handler: render grid

// player grid → ally board

// opponent grid → foe board

// That's much cleaner than having renderGrid() itself know about the Controller.

// Step 8 — Think carefully about the two boards

// There's an important issue in your current event handling.

// You currently have:

// allyBoard → playTurn
// foeBoard → placeShip

// That seems backwards based on the names.

// Normally I'd expect:

// Ally board

// → during deployment, clicking here places your ships.

// Foe board

// → during battle, clicking here attacks the opponent.

// Your current methods suggest:

// playTurn() eventually calls the Controller's attack logic.

// placeShip() eventually calls the Controller's ship-placement logic.

// So conceptually I'd double-check which DOM board should receive which action.

// This becomes particularly important because your gameState.status already distinguishes:

// "strategy"
// "playing"
// "finish"

// During "strategy" you want board clicks to mean placement.

// During "playing" you want board clicks to mean attacking.

// The Handler will eventually need to coordinate that.

// Step 9 — Don't make the Handler decide game rules

// For example, don't have the Handler decide:

// "We're in strategy mode, therefore I should call initialiseShip()."

// That's Controller/game logic.

// Instead, the Handler can communicate the user's intention:

// "The user clicked this coordinate."

// Then the Controller decides whether that action is valid given the current game state.

// You've already started doing this correctly with methods like:

// setShip(x, y)

// and:

// playTurn(x, y)

// The Handler says:

// "Here are the coordinates."

// The Controller says:

// "Can this happen right now?"

// That's the right direction.

// Step 10 — Your click handler eventually needs the coordinates

// This is another issue in the current code.

// You have bindBoardEvents(x, y), but your event listener doesn't appear to obtain the clicked cell's actual coordinates.

// You currently conceptually have:

// Board clicked → use x, y

// But where do x and y come from?

// The DOM needs to give your Handler some way of identifying which cell was clicked.

// A common approach is to give each rendered cell information corresponding to its row and column.

// For example, conceptually:

// DOM cell
//    ↓
// row = 4
// col = 7

// Then when the user clicks it:

// DOM event

// ↓

// Handler extracts coordinates

// ↓

// Handler tells Controller (4, 7)

// ↓

// Controller performs the appropriate game operation.

// This is where your rendering system and event system eventually connect.

// Step 11 — Rendering therefore needs to establish cell identity

// When your Handler renders the 12 × 12 grid, it needs to create 144 visual cells.

// Each one needs some way for the Handler to know:

// "This is row 3, column 8."

// You don't need to put your actual Cell object into the DOM.

// In fact, you shouldn't.

// Just give the DOM enough plain information to identify the cell.

// That fits perfectly with your architecture.

// So:

// GameBoard

// knows the actual cell.

// ↓

// Controller

// returns plain cell data.

// ↓

// Handler

// creates a DOM representation of that cell.

// ↓

// DOM contains coordinates identifying that visual cell.

// ↓

// User clicks it.

// ↓

// Handler extracts coordinates.

// ↓

// Controller receives coordinates.

// Step 12 — After an action, render again

// This is probably the most important part of the whole flow.

// Imagine the user attacks (4, 7).

// The flow should be:

// 1. User clicks a DOM cell

// ↓

// 2. Handler extracts (4, 7)

// ↓

// 3. Handler tells Controller to play the turn

// ↓

// 4. Controller performs the actual game logic

// ↓

// 5. GameBoard changes

// ↓

// 6. Ship/cell state changes

// ↓

// 7. Controller's grid representation now reflects the new state

// ↓

// 8. Handler requests the updated grid

// ↓

// 9. Handler renders the updated board

// That's the cycle.

// The Handler doesn't manually say:

// "Okay, that ship is now hit, so I'll change this DOM element."

// Instead, the game logic changes first.

// Then the Handler asks:

// "What does the board look like now?"

// And renders that state.

// That's a much safer architecture.

// Step 13 — This also explains why you want the copy

// Suppose the real game state contains:

// Ship instance

// with methods and internal state.

// The Handler doesn't receive that.

// Instead it receives something like:

// ship exists, length is 5, it has been hit twice, it isn't sunk.

// The Handler can turn that into visual information.

// For example:

// ship exists → display ship
// hit → display damaged state
// sunk → display sunk state
// miss → display miss marker

// But it can't accidentally call game methods or mutate your actual Ship.

// That's the boundary you were originally trying to establish, and yes, your approach accomplishes that.

// Step 14 — Your Elements class is fine

// I'd leave Elements relatively dumb.

// Its job is essentially:

// "Find the DOM things we care about and give us references to them."

// So:

// Handler → Elements → DOM

// The Handler can then say:

// "Render this grid into this.elements.allyBoard."

// The Elements class doesn't need to know anything about grids, players, ships, or game state.

// Step 15 — Your Controller should remain the authority

// This is the rule I'd keep in your head as you continue:

// Handler asks.
// Controller decides.

// For example:

// Handler:

// "User clicked here."

// Controller:

// "We're currently in strategy mode, so that means ship placement."

// Or:

// Handler:

// "User clicked here."

// Controller:

// "We're playing, so that means attack."

// Or:

// Handler:

// "User pressed random deployment."

// Controller:

// "Is random deployment still allowed?"

// That's why your status checks belong in the Controller rather than the Handler.

// Step 16 — One thing I would fix before continuing

// Your Handler constructor currently calls init(x, y) even though x and y aren't parameters of the constructor.

// That doesn't fit the event model you're building.

// The Handler doesn't need coordinates when it is constructed.

// The coordinates only become relevant when the user clicks a particular cell.

// So conceptually your lifecycle should be:

// Handler constructed

// ↓

// find DOM elements

// ↓

// bind events

// ↓

// render initial boards

// ↓

// wait

// ↓

// user clicks cell

// ↓

// determine clicked cell's coordinates

// ↓

// send coordinates to Controller

// ↓

// Controller changes game state

// ↓

// Handler refreshes rendering

// That's a much better mental model than passing x and y into init() when the Handler is created.

// The architecture I'd aim for

// Ultimately, your application should feel like this:

//                     CONTROLLER
//                          │
//              ┌───────────┴───────────┐
//              │                       │
//           game state              actions
//              │                       │
//              ↓                       ↓
//        Player / Board             attack
//        Player / Board             placement
//        Computer                   turns
//              │                       │
//              └───────────┬───────────┘
//                          │
//                   plain grid data
//                          │
//                          ↓
//                       HANDLER
//                          │
//               ┌──────────┴──────────┐
//               │                     │
//          render boards          handle clicks
//               │                     │
//               ↓                     ↓
//             DOM              Controller action

// And the really important loop is:

// Game state → Controller → Handler → DOM

// then, after user interaction:

// DOM → Handler → Controller → Game state

// then:

// Game state → Controller → Handler → DOM

// That is the cycle you're building.

// What I'd do next

// Don't implement everything at once. I'd proceed in this order:

// Fix the meaning of your Controller's grid getter so you can explicitly obtain the board you want.
// Decide what the UI needs to know about each cell.
// Create your Handler's renderGrid responsibility — just think through it before coding.
// Have the Handler render the two boards initially.
// Make each rendered cell identifiable by coordinates.
// Then connect clicks to your existing setShip() / playTurn() methods.
// Finally, refresh the board after each successful game-state change.

// That way you're building one clear bridge at a time rather than mixing rendering, events, and game logic together.