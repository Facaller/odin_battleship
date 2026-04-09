import { Ship } from "./Ship.js";
// Ship constructor tests
test('test initialisation', () => {
    const instance = new Ship(3, 0, false);
    expect(instance.length).toBe(3);
});

test('test initialisation', () => {
    const instance = new Ship(3, 0, false);
    expect(instance.hit).toBe(0);
});

test('test initialisation', () => {
    const instance = new Ship(3, 0, false);
    expect(instance.sunk).toBe(false);
});

// Ship class tests
test('is ship sunk', () => {
    const instance = new Ship(3, 2, false);
    expect(instance.isSunk()).toBe(false);
});

test('ship is hit', () => {
    const instance = new Ship(3, 0, false);
    expect(instance.isHit()).toBe(1);
});

test('ship hit does not exceed length', () => {
    const instance = new Ship(3, 3, true);
    expect(instance.isHit()).toBe(3);
});