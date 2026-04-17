import { GameBoard } from "./Gameboard";

test('test GameBoard initialisation', () => {
    const instance = new GameBoard();
    expect(instance.grid[3][5]).toEqual({
        hit:  false,
        miss: false,
        ship: null
    });
});

//placeShip

test('check object placement in cell', () => {
    const newShip = {length: 3}
    const game = new GameBoard();
    game.placeShip(newShip, 2, 0)
    expect(game.grid[1][0].ship).toBe(null);
    expect(game.grid[2][0].ship).toBe(newShip);
    expect(game.grid[3][0].ship).toBe(newShip);
    expect(game.grid[4][0].ship).toBe(newShip);
    expect(game.grid[5][0].ship).toBe(null);
});

//validateCoords

test('x placement inside grid', () => {
    const newShip = {length: 3};
    const game = new GameBoard();
    
    expect(game.validateCoords(newShip, 24, 22)).toBe(false)
});

test('y placement inside grid', () => {
    const newShip = {length: 3};
    const game = new GameBoard();
    
    expect(game.validateCoords(newShip, 22, 25)).toBe(false)
});

test('x-cord ship out of bounds', () => {
    const newShip = {length: 3};
    const game = new GameBoard();
    
    expect(game.validateCoords(newShip, 23, 21)).toBe(false)
});

test('y-cord ship out of bounds', () => {
    const newShip = {length: 3};
    const game = new GameBoard();
    
    expect(game.validateCoords(newShip, 21, 23)).toBe(false)
});

test('ship exists on coordinates', () => {
    const newShip = {length: 3};
    const game = new GameBoard();
    game.grid[1][0].ship = newShip;

    expect(game.validateCoords(newShip, 0, 0)).toBe(false);
});

test('ship does not exist on coordinates', () => {
    const newShip = {length: 3};
    const game = new GameBoard();
    game.grid[1][0].ship = newShip;
    game.grid[2][0].ship = newShip;
    game.grid[3][0].ship = newShip;

    expect(game.validateCoords(newShip, 4, 0)).toBe(true);
});

//missedAttack

test('cell marked as miss', () => {
    const newShip = {length: 3};
    const game = new GameBoard();
    game.grid[3][0].ship = newShip;
    game.missedAttack(0, 0);

    expect(game.grid[0][0].miss).toBe(true);
});

//receiveAttack

test('hit on coords', () => {
    const newShip = {length: 3};
    const game = new GameBoard();
    game.receiveAttack(0, 0)
    
    expect(game.grid[0][0].hit).toBe(true);
});

