export class GameBoard {
    constructor () {
        const rows = 24;
        const cols = 24;
        const cell = {
            hit:     false,
            miss:    false,
            hasShip: false,
        };

        const grid = Array.from({ length: rows }, () => Array(cols).fill(cell));
    }
}