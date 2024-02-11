import { describe, it, expect, vi } from 'vitest';

import { max, fizzBuzz, calculateAverage, factorial } from '../src/intro';

// you can nest describes for nice output when testing sub-suites of a suite of tests
// or you can put multiple describes in one file for all separate suites
describe('intro.test Suite', () => {
  describe('max', () => {
    it('should return the first argument if it is greater', () => {
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
    it('should return the first argument if it is greater', () => {
      expect(max(2, 1)).toBe(2);
    });

    it('should return the second argument if it is greater', () => {
      expect(max(1, 2)).toBe(2);
    });

    it('should return the first argument if arguments are equal', () => {
      // if they are both equal then how do we know if it actually returned the 1st or 2nd arg?
      // maybe it's tricking us?
      // Joking :-)
      expect(max(2, 2)).toBe(2);
    });
  });

  describe('fizzBuzz', () => {
    it('should be a function that takes a number argument (n)', () => {
      expect(fizzBuzz(1)).toBeDefined(); // helps with false positives to ensure the function exists
    });
    it('should return FizzBuzz if n is divisible by both 3 and 5', () => {
      expect(fizzBuzz(15)).toBe('FizzBuzz');
    });
    it('should return Fizz if n is divisible only by 3', () => {
      expect(fizzBuzz(6)).toBe('Fizz');
    });
    it('should return Buzz if n is divisible only by 5', () => {
      expect(fizzBuzz(5)).toBe('Buzz');
    });
    it('should return n as a string if n is not divisible by 3 or 5', () => {
      expect(fizzBuzz(7)).toBe('7');
    });
  });
});

// notice output since I didn't nest this one
describe('calculateAverage', () => {
  it('should return NaN if given an empty array', () => {
    expect(calculateAverage([])).toBe(NaN);
  });

  it('should return the average of an array with one number', () => {
    expect(calculateAverage([1])).toBe(1);
  });

  it('should return the average of an array with two numbers', () => {
    expect(calculateAverage([1, 2])).toBe(1.5);
  });

  it('should return the average of an array with three numbers', () => {
    expect(calculateAverage([1, 2, 3])).toBe(2);
  });
});

describe('factorial', () => {
  it('should return 1 for 0!', () => {
    expect(factorial(0)).toBe(1);
  });

  it('should return 1 for 1!', () => {
    expect(factorial(1)).toBe(1);
  });

  it('should return 2 for 2!', () => {
    expect(factorial(2)).toBe(2);
  });

  it('should return 6 for 3!', () => {
    expect(factorial(3)).toBe(6);
  });

  it('should return undefined for -n!', () => {
    expect(factorial(-1)).toBeUndefined();
  });
});
