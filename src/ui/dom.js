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
        const aiToggle = this.controller.toggleBattleAi();

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
            this.updateAllyBoard();
            this.updateFoeBoard();
            this.updateStatus('Fleet deployed');
        }
    }

    toggleOrientation () {
        const success = this.controller.toggleOrientation();

        if (!success) {
            this.updateStatus('The time for strategy has passed');
        } else {
            this.updateStatus('Strategic placement confirmed');
        }
    }

    renderGrid (grid, gridContainer) {
        grid.forEach((row, rowIndex) => {
            const rowElement = document.createElement('div');
            rowElement.classList.add('row');

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

    updateBoard (grid, gridContainer) {
        grid.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellElement = gridContainer.querySelector(
                    `.cell[data-row="${rowIndex}"][data-col="${colIndex}"]`
                );

                if (!cellElement) return;

                cellElement.classList.toggle('hit', cell.hit);
                cellElement.classList.toggle('miss', cell.miss);
                cellElement.classList.toggle('ship', cell.ship);
            });
        });
    }    

    updateAllyBoard () {
        const allyGrid  = this.controller.getPlayerOneGrid();
        const allyBoard = this.elements.allyBoard;

        this.updateBoard(allyGrid, allyBoard);
    }

    updateFoeBoard () {
        const foeGrid  = this.controller.getPlayerTwoGrid();
        const foeBoard = this.elements.foeBoard;

        this.updateBoard(foeGrid, foeBoard);
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
            this.toggleOrientation();
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
        const result = this.controller.handleBoardClicks(x, y);
        if (!result) return;
        console.log(`x = ${x} y = ${y}`);

        this.updateAllyBoard();
        this.updateFoeBoard();
    }
}