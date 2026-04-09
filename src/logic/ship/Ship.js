export class Ship {
    constructor (length, hit, sunk) {
        this.length = length;
        this.hit    = hit;
        this.sunk   = sunk
    }

    isSunk () {
        if (this.length === this.hit) {
            this.sunk = true;
        }
        return this.sunk;
    }

    isHit () {
        if (this.hit < this.length) {
            this.hit++
        }
        return this.hit;
    }
}
