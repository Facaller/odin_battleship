import { GameBoard } from "./Gameboard";

test('test GameBoard initialisation', () => {
    const instance = new GameBoard();
    expect(instance.grid[3][5]).toEqual({
        hit:     false,
        miss:    false,
        ship:    null
    });
});

test('check object placement in cell', () => {
    const newShip = {length: 3}
    const game = new GameBoard();
    game.placeShip(newShip, 0, 0)
    expect(game.grid[0][0].ship).toBe(newShip);
    expect(game.grid[1][0].ship).toBe(newShip);
    expect(game.grid[2][0].ship).toBe(newShip);
});

test('x placement inside grid', () => {
    const newShip = {length: 3};
    const game = new GameBoard();
    
    expect(game.placeShip(newShip, 25, 25)).toBe(null)
});

test('y placement inside grid', () => {
    const newShip = {length: 3};
    const game = new GameBoard();
    
    expect(game.placeShip(newShip, 24, 25)).toBe(null)
});

test('ship out of bounds', () => {
    const newShip = {length: 3};
    const game = new GameBoard();
    
    expect(game.placeShip(newShip, 23, 21)).toBe(null)
});