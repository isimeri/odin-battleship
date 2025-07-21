import Player from "../src/classes/Player";
import Gameboard from "../src/classes/Gameboard";

describe("Gameboard object", () => {
  const player1 = new Player("dingus", "human");
  const player2 = new Player("john", "computer");
  player1.setOpponent(player2);
  player2.setOpponent(player1);
  player1.gameboard.placeShip("scout", [2,2], "x");
  player2.gameboard.placeShip("frigate", [1,1], "x");


  test("should exist", () => {
    expect(player1).toBeDefined();
  });
  test("should have a name property of type string", () => {
    expect(player1).toHaveProperty("name");
    expect(typeof player1.name).toBe("string");
  });
  test("should have a gameboard property that's an array", () => {
    expect(player1).toHaveProperty("gameboard");
    expect(player1.gameboard).toBeInstanceOf(Gameboard);
  });
  test("should have a nextTargetCells property that's an array", () => {
    expect(player1).toHaveProperty("nextTargetCells");
    expect(Array.isArray(player1.nextTargetCells)).toBe(true);
  });
  test("should have an opponent property", () => {
    expect(player1).toHaveProperty("opponent");
  });
  test("should have an intelligence property of type string", () => {
    expect(player1).toHaveProperty("intelligence");
    expect(typeof player1.intelligence).toBe("string");
  });
  test("should return the result of the attack if able to perform one, or undefined otherwise", () => {
    let attackHit = player2.attack(2,2);
    let attackMiss = player2.attack(1,2);
    let attackSunk = player2.attack(3,2);

    expect(attackHit.attackResult).toBe("hit");
    expect(attackMiss).toBe("miss");
    expect(attackSunk.attackResult).toBe("sunk");
    expect(player2.attack(4,2)).toBeUndefined();
  });
  test("should return a pair of coordinates for the computer player to attack", () => {
    const arr = player2.computerChooseCell();

    expect(Array.isArray(arr)).toBe(true);
    expect(arr[0]).toBeLessThan(10);
    expect(arr[1]).toBeLessThan(10);
    expect(arr[0]).toBeGreaterThan(-1);
    expect(arr[1]).toBeGreaterThan(-1);
  });
  test("should return a suitable random pair of coordinates and an axis value for the computer player to place its ships", () => {
    const arr = player2.getRandomSuitableLocation(5);

    expect(Array.isArray(arr)).toBe(true);
    expect(arr[0]).toBeLessThan(10);
    expect(arr[1]).toBeLessThan(10);
    expect(arr[0]).toBeGreaterThan(-1);
    expect(arr[1]).toBeGreaterThan(-1);
    expect(typeof arr[2]).toBe("string")
  });
});