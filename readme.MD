## Unit test

Unit test are the most simple test that we can create, to ensure, a piece of code, does what we expect it to. Not for our present selves, but for the future programmers of the project.

Rules when testing:

- Do not do network, read files, or any other operation that has external dependancies, this can lead to enormous times waiting for disk, network, and inconsistencies.
- When unit testing, always go for the smaller functions in length and dependencies, this are easier to test, and unit test is the fastest test to execute

First example, division can have multiple edge cases, like dividing by 0, Infinity or using undefined/null values. in the example below, only big int division by 0 throws.

```javascript
function div(a, b) {
  return a / b;
}
describe("Test divide fn:", () => {
  test("it correctly divides", () => {
    expect(div(4, 2)).toBe(2);
  });
  test("it correctly divides big ints", () => {
    expect(div(4n, 2n)).toBe(2n);
  });
  test("it throws on divides big ints by 0n", () => {
    expect(() => div(4n, 0n)).toThrow();
  });
  test("it correctly returns Infinity on 0 division", () => {
    expect(div(4, 0)).toBe(Infinity);
  });
  test("it correctly returns NaN on Infinity/Infinity", () => {
    expect(div(Infinity, Infinity)).toBe(NaN);
  });
});
```

Such simple code, have a lot of edge cases and testing possibilities. Normally you will have to test all edge cases. Is better to test early, but if you did not see the edge case, in the first Iteration, add it as soon as you know about it.

### Expect

In the example before, we use some specific Jest functions (that are normally called the same in other testing libraries and even languages). the interesting one right now is **Expect**, it receives a value and returns an object with a ton of functions to verify what the value is or what happened for example

```javascript
expect(5 + 1).toBe(6); // pass
expect(true && false).toBe(false); //pass
```

In this example we have the function `toBe` as part of the returned object from expect you can check all properties/functions on: https://jestjs.io/docs/expect you can read it. but is better to have it handy and learn by doing

### Mocks Or Spies

Mock or Spies, let you spy on how a function is being used, and mock the output, For example, you can spy on a global function that is reading from files, or doing network request, as we don't want such behaviour, we mock it and return and show a values to test.
