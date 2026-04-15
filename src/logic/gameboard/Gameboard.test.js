import { GameBoard } from "./Gameboard";

test('test GameBoard initialisation', () => {
    const instance = new GameBoard();
    expect(instance.grid[3][5]).toEqual({
        hit:     false,
        miss:    false,
        ship:    null
    });
});

//placeShip

test('check object placement in cell', () => {
    const newShip = {length: 3}
    const game = new GameBoard();
    game.placeShip(newShip, 2, 0)
    expect(game.grid[0][0].ship).toBe(null);
    expect(game.grid[1][0].ship).toBe(null);
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

test('x-cord ship out of bounds', () => {
    const newShip = {length: 3};
    const game = new GameBoard();
    
    expect(game.placeShip(newShip, 23, 21)).toBe(null)
});

test('y-cord ship out of bounds', () => {
    const newShip = {length: 3};
    const game = new GameBoard();
    
    expect(game.placeShip(newShip, 21, 23)).toBe(null)
});

//checkCoordsForShip

test('ship exists on coordinates', () => {
    const newShip = {length: 3};
    const game = new GameBoard();
    game.placeShip(newShip, 0, 0);

    expect(game.checkCoordsForShip(1, 0)).toBe(true);
});

test('ship does not exist on coordinates', () => {
    const newShip = {length: 3};
    const game = new GameBoard();
    game.placeShip(newShip, 0, 0);

    expect(game.checkCoordsForShip(1, 1)).toBe(false);
});

//missedAttack

test('cell marked as miss', () => {
    const game = new GameBoard();
    game.missedAttack(0, 0);

    expect(game.grid[0][0].miss).toBe(true);
});

test('hit missed successfully', () => {
    const game = new GameBoard();
    game.missedAttack(0, 0)

    expect(game.missedAttack(0, 0)).toBe(true);
});

//receiveAttack

test('hit on coords', () => {
    const game = new GameBoard();
    game.receiveAttack(0, 0)
    expect(game.grid[0][0].hit).toBe(true);
});

