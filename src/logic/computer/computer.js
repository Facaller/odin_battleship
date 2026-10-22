export class Computer {
    constructor (player) {
        this.player = player;
    }
// add ai mehtods here
// player2 as in the constructor
// use player2 methods, but ai makes the deicions
// that way we use the same board instance
    generateCoords () {
        const x = Math.floor(Math.random() * 12);
        const y = Math.floor(Math.random() * 12) ;

        return {x, y};
    }
}