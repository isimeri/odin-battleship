import Game from "../src/classes/Game";
import Player from "../src/classes/Player";

describe("Gameboard object", () => {
  const magame = new Game();
  magame.init("FatAndSingle34", "Mary");
  magame.player1.gameboard.placeShip("scout", [2,2], "x");
  magame.player2.gameboard.placeShip("frigate", [1,1], "x");

  test("should exist", () => {
    expect(magame).toBeDefined();
  });
  test("should have a player1 property that is an instance of the Player class", () => {
    expect(magame).toHaveProperty("player1");
    expect(magame.player1).toBeInstanceOf(Player);
  });
  test("should have a player2 property that is an instance of the Player class", () => {
    expect(magame).toHaveProperty("player2");
    expect(magame.player2).toBeInstanceOf(Player);
  });
  test("should have a winner property", () => {
    expect(magame).toHaveProperty("winner");
  });
  test("should have a turn property that is of type string and starts at player1", () => {
    expect(magame).toHaveProperty("turn");
    expect(typeof magame.turn).toBe("string");
    expect(magame.getTurn()).toBe("player1");
  });
  test("should have a over property that is of type boolean", () => {
    expect(magame).toHaveProperty("over");
    expect(typeof magame.over).toBe("boolean");
  });
  test("should change turn on changeTurn() call", () => {
    magame.changeTurn();
    expect(magame.getTurn()).toBe("player2");
  });
  test("should set 'over' property to true if one of the players has all their ships sunk", () => {
    magame.player2.attack(2,2);
    magame.player2.attack(3,2);
    magame.checkForWin();
    expect(magame.isOver()).toBe(true);
  });
});