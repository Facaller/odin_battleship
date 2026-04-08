import { GameBoard } from "./Gameboard";

test('test GameBoard initialisation', () => {
    const instance = new GameBoard();
    expect(instance.grid[0][0]).toBe({
        hit:     false,
        miss:    false,
        hasShip: false
    });
});