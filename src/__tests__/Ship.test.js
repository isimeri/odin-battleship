import Ship from "../src/classes/Ship.js";

describe("Ship object", () => {
  const maship = new Ship("frigate");
  test("should exist", () => {
    expect(maship).toBeDefined();
  });
  test("should have the correct size", () => {
    expect(maship.size).toBe(3);
  });
  test("should have a name", () => {
    expect(maship.name).toBe("frigate");
  });
  test("should have a isSunk property", () => {
    expect(maship).toHaveProperty("isSunk");
  });
  test("should have a hits property that starts at 0", () => {
    expect(maship).toHaveProperty("hits");
    expect(maship.hits).toBe(0);
  });
  test("should return 'hit' when the ship is hit but is still not sunk", () => {
    expect(maship.hit()).toBe("hit")
  });
  test("should increment hits property on hit() call", () => {
    expect(maship.hits).toBe(1);
  });
  test("should return 'sunk' when the ship is sunk", () => {
    maship.hit();
    expect(maship.hit()).toBe("sunk")
  });
});