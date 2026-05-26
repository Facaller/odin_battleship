export class Computer {
    constructor (rows = 24, cols = 24) {
        this.availableMoves = [];

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                this.availableMoves.push([r, c]);
            }
        }
    }
// need to access grid to see if cell is hit. 
// Get random move in grid
// Successful move should find coord and remove from availableMoves array
//
    takeRandomMove () {
        const index = Math.floor(Math.random() * this.availableMoves.length);
        const move  = this.availableMoves[index];
        
        this.availableMoves.splice(index, 1);
        
        return move;
    }
}