import { describe, expect, it } from "vitest";
import {
  calculateDiscount,
  getCoupons,
  isPriceInRange,
  isValidUsername,
  validateUserInput,
} from "../src/core";

// array of objects
// each object has code: string, discount: number <0 - 1>
describe("getCoupons", () => {
  it("should return an array of  coupons", () => {
    const res = getCoupons();
    // make sure it is an actual array
    expect(Array.isArray(res)).toBe(true);
    expect(res.length).toBeGreaterThan(0);

    // toMatchObject and typeof = object both return false positive for array
    // because in javascript, an array is an object
    // so need the run time check like below
    // probably improved by using typescript. See Notes
    res.forEach((coupon) => {
      expect(!Array.isArray(coupon) && typeof coupon === "object").toBe(true);
    });
  });

  describe("coupon object", () => {
    it("should have a 'code' property that is a string", () => {
      const res = getCoupons();

      res.forEach((coupon) => {
        expect(coupon).toHaveProperty("code");
        expect(typeof coupon.code).toBe("string");
        expect(typeof coupon.code).toBeTruthy(); // no empty string
      });
    });

    it("should have 'discount' property that is a number between 0 and 1", () => {
      const res = getCoupons();

      res.forEach((coupon) => {
        expect(coupon).toHaveProperty("discount");
        expect(typeof coupon.discount).toBe("number");
        // not chainable but does not error so watch out for false positive if trying to chain
        // these two
        expect(coupon.discount).toBeGreaterThanOrEqual(0);
        expect(coupon.discount).toBeLessThanOrEqual(1);
      });
    });
  });
});

// Positive and negative testing
describe("calculateDiscount", () => {
  // the positive happy path
  it("should return discounted price if given a valid code", () => {
    expect(calculateDiscount(10, "SAVE10")).toBe(9);
    expect(calculateDiscount(10, "SAVE20")).toBe(8);
  });

  // the negative sad paths
  it("should handle non-numeric price", () => {
    expect(calculateDiscount("10", "SAVE10")).toMatch(/invalid/i);
  });

  it("should handle a negative price", () => {
    expect(calculateDiscount(-10, "SAVE10")).toMatch(/invalid/i);
  });

  it("should handle a non-string discount code", () => {
    expect(calculateDiscount(10, 0.1)).toMatch(/invalid/i);
  });

  // see notes on problem with code first approach here
  it("should handle an invalid discount code", () => {
    expect(calculateDiscount(10, "FOOBAR")).toBe(10);
  });
});

describe("validateUserInput", () => {
  it("should return success message if given valid input", () => {
    expect(validateUserInput("Bob", 18)).toMatch(/success/i);
  });

  it("should return invalid error, given a username < 3", () => {
    expect(validateUserInput("Bo", 18)).toMatch(/invalid/i);
  });

  it("should return invalid error, given a username > 255", () => {
    expect(validateUserInput("A".repeat(256), 18)).toMatch(/invalid/i);
  });

  it("should return invalid error, if age is not a number", () => {
    expect(validateUserInput("Bob", "foo")).toMatch(/invalid/i);
  });

  it("should return invalid error, given an age under 18", () => {
    expect(validateUserInput("Bob", 17)).toMatch(/invalid/i);
  });

  it("should return invalid error, given an age over 105", () => {
    expect(validateUserInput("Bob", 106)).toMatch(/invalid/i);
  });

  it("should return 2 invalid errors, given an age and username are invalid", () => {
    expect(validateUserInput("", 0)).toMatch(/invalid username/i);
    expect(validateUserInput("", 0)).toMatch(/invalid age/i);
  });
});

describe("isPriceInRange", () => {
  it("should return true if the price is between min and max", () => {
    expect(isPriceInRange(2, 1, 3)).toBe(true);
  });

  it("should return true if the price is equal to min or max", () => {
    expect(isPriceInRange(1, 1, 3)).toBe(true);
    expect(isPriceInRange(3, 1, 3)).toBe(true);
  });

  it("should return false if the price is outside min and max", () => {
    expect(isPriceInRange(1, 2, 4)).toBe(false);
    expect(isPriceInRange(5, 2, 4)).toBe(false);
  });
});

describe("isValidUsername", () => {
  const minLength = 5;
  const maxLength = 15;

  it("should return true if the username is 5 - 15 characters", () => {
    expect(isValidUsername("J".repeat(minLength + 1))).toBe(true);
    expect(isValidUsername("J".repeat(maxLength - 1))).toBe(true);
  });

  it("should return true if the username is 5 or 15 characters", () => {
    expect(isValidUsername("J".repeat(minLength))).toBe(true);
    expect(isValidUsername("J".repeat(maxLength))).toBe(true);
  });

  it("should return false if the username is less than 5 or more than 15 characters", () => {
    expect(isValidUsername("J".repeat(minLength - 1))).toBe(false);
    expect(isValidUsername("J".repeat(maxLength + 1))).toBe(false);
  });

  it("should return false for invalid input type string", () => {
    expect(isValidUsername("")).toBe(false);
    expect(isValidUsername(null)).toBe(false);
    expect(isValidUsername(undefined)).toBe(false);
    expect(isValidUsername(2)).toBe(false);
    expect(isValidUsername([])).toBe(false);
    expect(isValidUsername({})).toBe(false);
  });
});
