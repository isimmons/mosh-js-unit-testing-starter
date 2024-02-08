import { describe, expect, it } from "vitest";
import { getCoupons } from "../src/core";

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
