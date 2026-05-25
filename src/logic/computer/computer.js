export class Computer {
    constructor () {
        this.availableMoves = [];
    }
// need to access grid to see if cell is hit. 
// Get random move in grid
// Successful move should find coord and remove from availableMoves array
//
    getRandomMove () {
        const index = Math.floor(Math.random() * 24);
        return index;
    }
}

// class Computer {
//     constructor(rows, cols) {
//       this.availableMoves = [];
  
//       for (let r = 0; r < rows; r++) {
//         for (let c = 0; c < cols; c++) {
//           this.availableMoves.push({ row: r, col: c });
//         }
//       }
//     }
  
//     getMove() {
//       const index = Math.floor(Math.random() * this.availableMoves.length);
//       return this.availableMoves.splice(index, 1)[0];
//     }
//   }