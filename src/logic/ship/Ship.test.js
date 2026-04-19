import { Ship } from "./Ship.js";
// Ship constructor tests
test('test initialisation', () => {
    const instance = new Ship(3);
    expect(instance.length).toBe(3);
});

test('test initialisation', () => {
    const instance = new Ship(3);
    expect(instance.hit).toBe(0);
});

test('test initialisation', () => {
    const instance = new Ship(3);
    expect(instance.sunk).toBe(false);
});

// Ship class tests
test('is ship sunk', () => {
    const instance = new Ship(3, 2);
    expect(instance.isSunk()).toBe(false);
});

test('ship has sunk', () => {
    const instance = new Ship(3, 2);
    instance.isHit();
    expect(instance.isSunk()).toBe(true);
});

test('ship is hit', () => {
    const instance = new Ship(3);
    expect(instance.isHit()).toBe(1);
});

test('ship hit does not exceed length', () => {
    const instance = new Ship(3, 3, true);
    expect(instance.isHit()).toBe(3);
});