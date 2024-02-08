// Lesson: Writing your first tests
// export function max(a, b) {
//   if (a > b) return a;
//   else if (b > a) return b;
//   return a;
// }

// refactor with confidense. If test still passes then we're good
export function max(a, b) {
  return a > b ? a : b;
}

// Exercise
export function fizzBuzz(n) {
  if (n % 3 === 0 && n % 5 === 0) return "FizzBuzz";
  if (n % 3 === 0) return "Fizz";
  if (n % 5 === 0) return "Buzz";
  return n.toString();
}

export const calculateAverage = (numbers) => {
  if (numbers.length === 0) return NaN;

  const sum = numbers.reduce((sum, current) => sum + current, 0);

  return sum / numbers.length;
};
