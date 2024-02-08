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

# Matchers

There are many matchers that can be easily found in the [docs](https://vitest.dev/api/expect.html) and I should not try to memorize right now but one important thing to remember is the difference betwen toBe and toEqual when it comes to javascript objects. In javascript { name: "Ian" } is not the same as { name: "Ian" } because they are two different objects in memory. In these cases we want to test the value of both objects, not the equality of the objects themselves so in vitest we can use toEqual instead of toBe.
