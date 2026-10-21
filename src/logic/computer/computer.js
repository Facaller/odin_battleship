export class Computer {
    constructor (rows = 24, cols = 24) {
        this.availableMoves  = [];

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                this.availableMoves.push([r, c]);
            }
        }
    }
// add ai mehtods here
// player2 as in the constructor
// use player2 methods, but ai makes the deicions
// that way we use the same board instance
    takeRandomMove () {
        const index = Math.floor(Math.random() * this.availableMoves.length);
        const move  = this.availableMoves[index];
        
        this.availableMoves.splice(index, 1);
        
        return move;
    }
}