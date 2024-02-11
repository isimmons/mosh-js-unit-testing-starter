import { it, expect, describe } from 'vitest';
import { calculateDiscount } from '../src/main';

describe('calculateDiscount', () => {
  // the positive happy path
  it('should return discounted price if given a valid code', () => {
    expect(calculateDiscount(10, 'SAVE10')).toBe(9);
    expect(calculateDiscount(10, 'SAVE20')).toBe(8);
  });

  // the sad path
  it('should handle a negative price', () => {
    expect(calculateDiscount(-10, 'SAVE10')).toMatch(/invalid/i);
  });

  // see notes on problem with code first approach here
  it('should handle an invalid discount code', () => {
    expect(calculateDiscount(10, 'FOOBAR')).toBe(10);
  });
});
