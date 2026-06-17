import { GameBoard } from "./Gameboard";

test('test GameBoard initialisation', () => {
    const instance = new GameBoard();
    expect(instance.grid[3][5]).toEqual({
        hit:  false,
        miss: false,
        ship: null
    });
});

//createShip

test('creates Ship', () => {
    const game = new GameBoard();
    const ship = game.createShip(3);
    expect(ship).toEqual(expect.any(Object));
});

//placeShip

test('ship placed along x axis', () => {
    const game = new GameBoard();
    game.initialiseBarracks();
    const newShip = game.barracks[0];
    game.placeShip(2, 0)
    expect(game.grid[1][0].ship).toBe(null);
    expect(game.grid[2][0].ship).toBe(newShip);
    expect(game.grid[3][0].ship).toBe(newShip);
    expect(game.grid[4][0].ship).toBe(newShip);
    expect(game.grid[9][0].ship).toBe(null);
});

test('ship placed along y axis', () => {
    const game = new GameBoard();
    game.initialiseBarracks();
    const newShip = game.barracks[0];
    game.orientation = 'vertical';
    game.placeShip(2, 4)
    expect(game.grid[2][3].ship).toBe(null);
    expect(game.grid[2][4].ship).toBe(newShip);
    expect(game.grid[2][5].ship).toBe(newShip);
    expect(game.grid[2][6].ship).toBe(newShip);
    expect(game.grid[2][12].ship).toBe(null);
});

//fillFleet

test('fleet is filled by random placement', () => {
    const game = new GameBoard();
    game.initialiseBarracks();
    game.deployFleet();

    expect(game.fleet.length).toEqual(7);
});

//validateCoords

test('x placement inside grid', () => {
    const game = new GameBoard();
    
    expect(game.validateCoords(24, 22)).toBe(false)
});

test('y placement inside grid', () => {
    const game = new GameBoard();
    
    expect(game.validateCoords(22, 25)).toBe(false)
});

//validateShipCoords

test('x-cord ship out of bounds', () => {
    const newShip = {length: 3};
    const game = new GameBoard();
    
    expect(game.validateShipCoords(newShip, 23, 21)).toBe(false)
});

test('y-cord ship out of bounds', () => {
    const newShip = {length: 3};
    const game = new GameBoard();
    
    expect(game.validateShipCoords(newShip, 21, 23)).toBe(false)
});

test('ship exists on coordinates', () => {
    const newShip = {length: 3};
    const game = new GameBoard();
    game.grid[1][0].ship = newShip;

    expect(game.validateShipCoords(newShip, 0, 0)).toBe(false);
});

test('ship does not exist on coordinates', () => {
    const newShip = {length: 3};
    const game = new GameBoard();
    game.grid[1][0].ship = newShip;
    game.grid[2][0].ship = newShip;
    game.grid[3][0].ship = newShip;

    expect(game.validateShipCoords(newShip, 4, 0)).toBe(true);
});

//random coordinates generator

test('returns an array; array has two values', () => {
    const game = new GameBoard();

    expect(game.createRandomCoords()).toEqual(expect.any(Array));
    expect(game.createRandomCoords()).toHaveLength(2);

    // result.forEach(item => {
    //     expect(item).toBeGreaterThanOrEqual(0);
    //     expect(item).toBeLessThanOrEqual(9);
    //   });
});

test('items are within grid size', () => {
    const game = new GameBoard();
    const randomArray = game.createRandomCoords();

    expect(randomArray.forEach(item => {
        expect(item).toBeGreaterThanOrEqual(0);
        expect(item).toBeLessThanOrEqual(game.grid.length);
    }))
})

//receiveAttack

test('coords register hit', () => {
    const newShip = {length: 3};
    const game = new GameBoard();
    game.receiveAttack(0, 0)
    
    expect(game.grid[0][0].hit).toBe(true);
});

//missedAttack

test('cell marked as miss', () => {
    const newShip = {length: 3};
    const game = new GameBoard();
    game.grid[3][0].ship = newShip;
    game.missedAttack(0, 0);

    expect(game.grid[0][0].miss).toBe(true);
});

//deployShip

test('deploys ship', () => {
    const game = new GameBoard();
    game.initialiseBarracks();
    const newShip = game.barracks[0];
    game.deployShip();

    expect(game.fleet[0]).toBe(newShip)
});

test('fleet contains true reference', () => {
    const game = new GameBoard();
    game.initialiseBarracks();
    const newShip = game.barracks[0];
    game.placeShip(1, 4);
    game.receiveAttack(1, 4);

    expect(game.fleet[0]).toEqual(newShip);
});

//allShipsSunk

test('all ships sunk', () => {
    const game = new GameBoard();
    game.initialiseBarracks();
    game.deployFleet();
    
    game.fleet.forEach(ship => {
        ship.sunk = true;
    });

    expect(game.allShipsSunk()).toBe(true);
});

test('all ships not sunk', () => {
    const game = new GameBoard();
    game.initialiseBarracks();
    game.deployFleet();
    
    game.fleet.forEach(ship => {
        ship.sunk = true;
    });
    game.fleet[4].sunk = false;

    expect(game.allShipsSunk()).toBe(false);
});