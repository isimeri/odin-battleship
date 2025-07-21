import Gameboard from "../src/classes/Gameboard";
import Ship from "../src/classes/Ship";

describe("Gameboard object", () => {
  const maboard = new Gameboard();
  const maship = maboard.createShip("frigate");

  test("should exist", () => {
    expect(maboard).toBeDefined();
  });
  test("should have a board property that's an array", () => {
    expect(maboard).toHaveProperty("board");
    expect(Array.isArray(maboard.board)).toBe(true);
  });
  test("should have an axis property of type string that has an initial value of 'x'", () => {
    expect(maboard).toHaveProperty("axis");
    expect(typeof maboard.axis).toBe("string");
    expect(maboard.axis).toBe("x");
  });
  test("should have a fleet property that's an array", () => {
    expect(maboard).toHaveProperty("fleet");
    expect(Array.isArray(maboard.fleet)).toBe(true);
  });
  test("should have a shipsYetToBePlaced property that's an array", () => {
    expect(maboard).toHaveProperty("shipsYetToBePlaced");
    expect(Array.isArray(maboard.shipsYetToBePlaced)).toBe(true);
  });
  test("should have an activeShipToBePlaced property of type string", () => {
    expect(maboard).toHaveProperty("activeShipToBePlaced");
    expect(typeof maboard.activeShipToBePlaced).toBe("string");
  });
  test("should change the axis on changeAxis() call", () => {
    maboard.changeAxis();
    expect(maboard.axis).toBe("y");
  });
  test("should create a Ship instance on createShip() call", () => {
    expect(maship).toBeInstanceOf(Ship);
  });
  test("should return a boolean value that says if a ship can be placed in a certain spot or not", () => {
    expect(maboard.isGoodPosForPlacement(0,0,3,"x")).toBe(true);
    expect(maboard.isGoodPosForPlacement(9,9,3,"x")).toBe(false);
  });
  test("should return 1 if placed a ship successfully and undefined otherwise", () => {
    expect(maboard.placeShip("submarine", [0,1], "x")).toBe(1);
    expect(maboard.placeShip("scout", [9,9], "x")).toBeUndefined();
  });
  test("should return the result of the attack", () => {
    expect(maboard.takeHit(0,1).attackResult).toBe("hit");
    expect(maboard.takeHit(2,8)).toBe("miss");
  });
  test("should return a modified version of the board for the opponent to see", () => {
    expect(Array.isArray(maboard.getOpponentView())).toBe(true);
  });
});