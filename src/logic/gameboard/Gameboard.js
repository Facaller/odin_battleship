export class GameBoard {
    constructor () {
        const rows = 24;
        const cols = 24;

        this.grid = Array.from({ length: rows }, () => 
            Array.from({ length: cols }, () => ({
                hit:     false,
                miss:    false,
                hasShip: false,
            }))
        );
    }
}