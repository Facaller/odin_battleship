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

// Ship sunk tests

