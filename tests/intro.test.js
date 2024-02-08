import { describe, test, it, expect } from "vitest";

import { max } from "../src/intro";

describe("max", () => {
  it("should return the first argument if it is greater", () => {
    // AAA
    // Arange
    const a = 2;
    const b = 1;

    // Act
    const result = max(a, b);

    // Assert
    expect(result).toBe(2);
  });

  // AAA is not allways nessessary. This one liner is OK but just like when writing code,
  // don't go overboard. It should be clean and easy to understand
  it("should return the first argument if it is greater", () => {
    expect(max(2, 1)).toBe(2);
  });

  it("should return the second argument if it is greater", () => {
    expect(max(1, 2)).toBe(2);
  });

  it("should return the first argument if arguments are equal", () => {
    // if they are both equal then how do we know if it actually returned the 1st or 2nd arg?
    // maybe it's tricking us?
    // Joking :-)
    expect(max(2, 2)).toBe(2);
  });
});
