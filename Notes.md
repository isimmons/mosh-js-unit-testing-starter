# My Notes

These are my own notes and opinions, not nessessarily Mosh. I'm learning from Mosh but don't take anything I say here to be a direct quote from him.

## Unit Testing

Unit testing tests individual units of code. This can be a function, class, component, or module.

Classes, components, and modules can be broken down into individual function/method tests.

Unit tests help catch and fix bugs early in development. Unit tests also help to do refactoring with confidence meaning if tests are automated every time you make a code change, you can see if you broke something early. If you've ever done a big refactor that broke your app and had to go back through the code trying to figure out which change actually broke the app then automated unit testing may have saved a lot of time and headache.

## Integration Tests

Integration tests focus on how multiple units or components of your application work together as a whole.

### Notes on components

A component should be pure, meaning that it always returns the same result, given the same input. This is a deeper subject that I'll add to later. But, I would say that unit testing components should help to spot impure components.

It seems to me that the line between unit and integration testing can blur when dealing with classes, modules, components. A component for example may have multiple other components that are part of it. So in this case are we doing an integration test or a unit test when we test the parent component? More on this later.

## End to End Tests (E2E)

E2E tests test the entire application as a whole by simulating user interactions. (ie. A user logs in, is redirected to the blog posts page, posts are loaded from a database or mocked, and the user sees a list of blog posts). This tests a path through the app from start to finish.

E2E tests are slower but give the highest level of confidence that our app is working as expected. But we need unit tests because if all we use is E2E tests, I think it leaves room to forget about certain edge cases or to only test the "happy path" and forget about the "what if's" that can pop up at any point from our apps entry point to the server.

### My thoughts testing types

The more unit tests we have, the easier it is to quickly know exactly where in the code a bug is.
Too many unit tests can become rediculous.
I would agreen that in many cases the suggested testing pyramid is the right way to go. What this means is more unit tests than integration and more integration than E2E but as Mosh points out, the specific type of app may work better with a different ratio so there is no "one size fits all"

TDD is something that I don't think many people actually follow strictly but it can help in reasoning about the code, wishful coding (write the test for the API you want so the test requires the unit to be written that way), and writing new functions as part of a refactor or extraction so you know it works before you use it to replace existing code.

TDD helps prevent overenginneering if we do it right. If we write the first test and then write
only the simplest logic to make the test pass and then only add to the code after first writing
a new test then we won't write unnessessary or overengineered code.

It just occurred to me that writing the test after the code, I have to do things like changing the code to make sure my test is testing the correct behavior and not getting a false positive/negative. With strict TDD the test doesn't pass until I write the minimal code to pass so it has to be the correct behavior. In other words, write code, test, remove code, test, add code back to ensure my test wasn't passing for the wrong reason vs TDD way, write test, fail, add code, test pass. Strict TDD cuts out all the jumping back and forth between test file and production file. When the test turns green and I'm happy with the code structure, I can feel confident in jumping once back to the test file to move on with the next test.

This is made evident again in the validateUserInput function as Mosh points out that our function is not checking for log usernames. I don't think this is something where we should pick and choose when we are going to use proper TDD. Either don't or do it always if you have the chance by starting at the beginning of the project. Otherwize just know you'll always need to think through the logic with plans on changing the implimentation. Either way you need to focus and follow a standard.

# Testing basics

The AAA pattern stands for Arrange, Act, Assert and is a good basic template for writing tests.
Arrange (setup env, data, configs needed for the test)
Act (perform the action of running the function or unit being tested)
Assert (assert that we get the correct result from the action)

# VSCode shortcuts

ctrl+p opens 'go to file' ( type name or abbreviation, arrow down and/or enter)
ctrl+p type @ shows symbols in current file
ctrl+p type : shows line numbers, type number and enter to go to line in current file
look at "go" menu to see shortcuts for back and forward cursor pos in current file

# code coverage

100% code coverage thought to be unrealistic because you can't spend all your time writing tests
and not deliver code. But do you want to deliver broken code? Code coverage is not a garanteed
bug free code. But isn't code coverage closer to being garanteed than no coverage? Lot's to think
about. A lot of OSS projects require tests along with PRs and the tests must pass along with existing tests in the project before a PR can be approved. I guess this is one way to make it easier by having individual contributors be responsible for coverage on the parts of code they submit in PRs. But a dev team might need to have certain people assigned to test and approve new features before shipping them so at least a large part of the team could focus on writing code? IDK

Demonstrated the importance of a coverage tool in the calculateDiscount test. Originally the test for a valid code was passing but only covered the case for 'SAVE10' so when I ran coverage I could see in the function that everything but the condition for 'SAVE20' was covered. Normally I would not be listing if conditionals for every possible valid code but instead would be itterating a list of valid codes and a typescript union might render some of this unnessessary too. But for demo purpose, this was a good simple one.

# Good test Characteristics

## Maintainable

- clear naming
- small (ideally less than 10 lines suggested by Mosh)
- test a single behavior
- clear variables and constants
- properly formatted (thanks prettier)

## Robust 🐖

A test that is resilient to changes in the code.

- test behavior and not the implimentation (the what, not the how)
- avoid tight assertions (exact text and error messages)

## Trustworthy 🤝🔒👥

- code works
- when fails, something is wrong with the code, not the test
- no false positives or false negatives
- validates correct behavior
- test boundary conditions (empty arrays, null, undefined, extreme values)
- deterministic (produce same results every time)
- purity (no random data, current date/time, global state)
- tests should be isolated from each other and from knowlege of implimentation in the production code

# Tight assertion

A tight assertion can be a problem in the following example

## tight string assertion

```js
it("should", () => {
  const result = "The requested file was not found.";
  // too general
  expect(result).toBeDefined();
  // too tight
  expect(result).toBe("The requested file was not found.");
  // better
  expect(result).toMatch("not found");
  // case insensitive regex may be even better
  expect(result).toMatch(/not found/i);
});
```

If the period changes to an ! the test fails. But one could argue that copy text might not need to be open to the idividual devs on a team to make changes on a whim. Maybe for certain teams, very strict adherence to specific text is required. This brings up another issue on the production side though. If you want central control over the text of error messages, there should be defined constants like `const FILE_NOT_FOUND = "The requested file was not found."` These constants can be shared between the production and testing environments.

## tight array/object assertion

```js
it("should array", () => {
  const res = [1, 2, 3];
  // Loose
  expect(res).toBeDefined();
  // Tight
  expect(res).toEqual([1, 2, 3]);
  // better, not dependant on order of the elements
  expect(res).toEqual(expect.arrayContaining([3, 2, 1])); // passes
  // some cases require specific length
  expect(res).toHaveLength(3);
  // or non empty array
  expect(res.length).toBeGreaterThan(0);
});

it("should object", () => {
  const res = { name: "Ian" };

  // tight
  expect(res).toEqual({ name: "Ian" });
  // looser, matches subset, will pass if we add id property to the object
  expect(res).toMatchObject({ name: "Ian" });
  // looser still, check presense of property only, no value check
  // also takes second arg for value of property
  expect(res).toHaveProperty("name");
  // check typeof
  expect(typeof res.name)toBe('string');
});
```

# Matchers

There are many matchers that can be easily found in the [docs](https://vitest.dev/api/expect.html) and I should not try to memorize right now but one important thing to remember is the difference betwen toBe and toEqual when it comes to javascript objects. In javascript { name: "Ian" } is not the same as { name: "Ian" } because they are two different objects in memory. In these cases we want to test the value of both objects, not the equality of the objects themselves so in vitest we can use toEqual instead of toBe.

We can match types with typescript enabled. [expectTypeof](https://vitest.dev/api/expect-typeof)
Not currently using typescript in this project but most def will in my own projects

toBeGreaterThan, toBeLessThan not chainable and there is no toBeInBetween. So silly...

# More Notes

## single responsibility tests

Notice in core.test.js, the getCoupons test suite
Each test has a single logical responsibility even though there are multiple assertions. Some might argue that a test should have a single assertion. Some might be silly too. Multiple assertions are a flag, telling you to pay extra attention and see if you are grouping responsibilities but if not, then this is fine. The first tests responsibility is to ensure that the function returns an array of coupons so there must be at least one coupon and it must be a coupon which means it must be an object. Subsequent tests test the actual coupon object properties

## positive vs negative testing

Positive testing ensures the application works correctly under normal conditions (the happy path)
Negative testing tests how the application handles unexpected or incorrect input (the sad path)

Test the happy path first. Then it will be followed most likely, by multiple sad paths but it will be easier to see that you have tested all of the negatives if you can clearly see the positive at the top of the test suite.

A lot of this will be unnessessary when using typescript because the TS compiler will not allow many of the potential negative paths. This is no garantee because 1 is a number and so is 10 but our happy path may be a number less than 5 so typescript would not help us there. But, non numeric values would not need to be tested for if we have typed our function param as number.

# calculateDiscount code first problem

A problem arose with the code first approach when testing calculateDiscount.
For the last test, when it failed, I thought in a TDD mindset plus testing for valid codes from a list of valid codes actually makes more sense. But the problem was actually that the test was testing the wrong thing because the function was written to return the input price if the code is invalid. While this is the correct price (no discount price) we aren't really handling it in the same way as the other negative tests by returning an error message. So I wrote the test wrong, then changed the code in the function, then realized the function was right, changed it back and then changed my test to work for the function. I had no documentation and no way of knowing that the function was actually doing what it was supposed to do because I was writing a test for an already existing function with nothing to go on but the existing code and my assumptions of how it was supposed to work.

# Boundary Testing

Boundary testing focuses on the edges or boundaries of input values to ensure software behaves correctly under extreme conditions. For example isPriceInRange returns a boolean if the price is betwen or equal to a min and max. We need 3 tests. 1 is it inside the boundary, 2 is it outside the boundary, 3 is it at the edge of the boundary (2 part 2nd and 3rd tests because we have a min/max)

## Defensive Programming

Type checking every input possibility is part of defensive programming. Some would argue the boundary for the input is where this defensive programming should take place. For example, when the user inputs a piece of data instead of in a function where we pass that data too. In other words by the time the data gets to function B from function A, it should already have been checked in function A before A passed it on to function B. I'm not sure I agree with this. If I'm testing function B I should not be thinking about function A so I should not assume that function A did it's job correctly unless I have a unit test for function A that confirms it. Typescript will take care of this if the data is correctly typed before being sent to function B. Also if the parameter is correctly typed in function B and not in function A it will either be correctly inferred or it will be of type implicit any in which case I will need to do the runtime type check to satisfy Typescript.

# Parameterized Tests

Also called data driven tests are a way to run the same test multiple times with different sets of input data. Several tests may have the same logic but just use different data. See the parameterized version of canDrive and isPriceInRange

# Asyncronous Testing

To test asyncronous code is not very different from running asyncronous code in production. As you can see in the fetchData test I have left both an async/await version and a then/catch version. In the production code is a simple promise rejection just for demonstrating the catch tests. In reality some condition would cause a failure, triggering a rejection or thrown error but the test passes and covers both success and fail scenarios.

# Basic setup and teardown

beforeEach (before each test)
beforeAll (run once before running tests in the test suite)
afterEach (after each test)
afterAll (after all tests have run in the test suite)
We may need to setup certain data, mocks, db connections for tests and then clean them up after tests have run. This is what setup and teardown is about.

In the stack test I create a new instance of Stack before each test and use a context parameter in the callback of beforeEach which is passed to each test. The same context is used in afterEach where I delete the stack instance. This ensures I have a clean starting point for each test.

I could also have used a `let stack;` scoped to the whole test suite and set/delete it in the beforeEach/afterEach hooks. In hindsight, this would have been easier that having to type context.stack all those times.

```js
let stack;

beforeEach(() => {
  stack = new Stack();
});

afterEach(() => {
  delete stack;
});

it("should be an instance of Stack", () => {
  console.log(stack);
  expect(stack instanceof Stack).toBe(true);
});
```

Then in each test I use the built in array methods to do the work and test only the stack method under test. If I were to use stack.push and stack.clear directly in the test for stack.size or stack.isEmpty then this would couple my tests together. They would have to run in order to ensure the needed methods were available and working correctly. In the course Mosh uses untested stack methods in the setup for other methods. In some cases this may be nessessary and in a way provides extra testing on those methods but in the case of our stack, items is an array so built in array methods can be used. In other cases the way Mosh does it could potentially cause confusion on where the error actually is if there is an error. This is because vitest won't give me an error like "stack.foo is not a function" or other errors that might be thrown by stack.foo when I'm using stack.foo in the setup for testing stack.bar. vitest will just tell me stack.bar expected foo but recieved undefined or whatever.

Some people would say this is not the purpose of beforeEach/afterEach and each test should handle it's own setup as far as vars used in the test. I don't see an issue with this though. At least not at this point. Opinions change with education though. I have more to learn.

Also used nested describe blocks for cleaner console output

# Mocking, Mock Functions

A mock function imitates the behavior of a real function. It is not a test of the function being mocked and is not concerned with the implimentation of the function being mocked. It simply imitates the behavior of the function so it can be provided to another function that is actually the one under test. For example mocking a db call with a simple function that just returns data without actually making a db call could be used to test another function that normally requires making that real db call in order to do it's work. The function under test doesn't care if the db call is real. It just needs to make the db call and get some data from it so it doesn't know the difference. This can get complicated depending on the real world return data from the real db call because we need to imitate it exacly in order to get accurate testing on the tested function. Usually the main purpose of mocking is to get around slow db calls, keep the test isolated (we're not doing integration or systems testing), or maybe in certain situations it is difficult or impossible to get access to the data layer from within our test so we need to mock it. In a way, I was mocking stack method behaviors (see notes under setup teardown) by using built in array methods to ensure the method under test was tested in isolation.

## Mock modules

In the getPriceInCurrency function in mocking.js we call the imported getExchangeRate function. In the getExchangeRate function it returns Math.random(). The function we are testing is getPriceCurrency but we want our testing to be pure which means it cannot accept random values for input. So we will mock the getExchangeRate function so we can control it's return value.

# Interaction Testing

Testing how the function under test interacts with another function. We've already done this but lets put a name to it. See test renderPage where we mock our simulated call to analytics (trackPageView); We run 2 tests here. 1 to make sure renderPage renders the correct content. 2 to make sure renderPage calls trackPageView with path parameter "/home"

# Partial Mocking

We don't always want to mock every function in the module but just the one we actually need to mock for a certain test case/suite. In email.js isValidEmail is just a utility function to tell if an email is valid or not. There is nothing random or dynamic about it so there is no reason to mock it. But in the same module sendEmail needs to be mocked because we don't want to actually send emails during testing of the function that calls it. See how we partially mock the email module.
