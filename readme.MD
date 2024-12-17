## Unit test

Unit test are the simplest test that we can create, to ensure, a piece of code, does what we expect it to. Not for our present selves, but for the future programmers of the project.

Rules when testing:

- Do not do network, read files, or any other operation that has external dependencies, this can lead to enormous times waiting for disk, network, and inconsistencies.
- When unit testing, always go first for the smaller functions in length and dependencies, these are easier to test, and unit test is the fastest test to execute

First example, division can have multiple edge cases, like dividing by 0, Infinity or using undefined/null values. In the example below, only big int division by 0 throws.

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

Such simple code, have a lot of edge cases and testing possibilities. Normally, you will have to test all edge cases. It is better to test early, but if you did not see the edge case, in the first Iteration, add it as soon as you know about it.

### The Expect function

In the example before, we use some specific Jest functions (that are normally called the same in other testing libraries and even languages). The interesting one right now is **Expect**, it receives a value and returns an object with a ton of functions to verify what the value is or what happened, for example:

```javascript
expect(5 + 1).toBe(6); // pass
expect(true && false).toBe(false); //pass
```

In this example we have the function `toBe` as part of the returned object from expect, you can check all properties/functions on: https://jestjs.io/docs/expect you can read it.
But is better to have it handy and learn by doing, there will be examples in the tests under `tests` folder in the root of this project.

Another case that comes regularly is expecting from Promises you can do this several ways, one is

```javascript
return fetch("...")
  .then((data) => {
    expect(data).toBe(someData);
  })
  .catch((err) => {
    expect(err).toBe(someError);
  });
```

In this way, you need to return a Promise.

We can also use the expressiveness of async/await

```javascript
test("fetch test", async () => {
  const data = await fetch("...");
  expect(data).toBe(someData);
});
// or
test("fetch test", async () => {
  try {
    const data = await fetch("...");
  } catch (err) {
    expect(err).toBe(someError);
  }
});
```

### Mocks Or Spies

Mock or spies, let you spy on how a function is being used, and mock the output, For example, you can spy on a global function that is reading from files, or doing network request, as we don't want such behavior, we mock it and return the values to test.

In the case of Jest, we can mock globals, but first we need to add them to Jest globals in the `jest.config.js`:

```javascript
  globals: {
    fetch: global.fetch,
  },
```

Then we can mock the fetch in global like

```javascript
const fetchSpy = jest.spyOn(globalThis, "fetch").mockReturnValue(
  Promise.resolve({
    status: 200,
    json: async () => returnObject,
  })
);
```

In our next challenge, we go to the backend code, and when trying to mock our `createPost` function

```javascript
export async function createPost(title, body, tags) {
  const post = new PostModel({
    title,
    body,
    tags,
    createdAt: new Date(),
  });
  return await post.save();
}
```

In this case we're working with `mongoose` and PostModel object creation, is simple and can be done without mocking, but the `post.save();` line, will try to contact the database, which we don't want as test would become flaky, because it could fail for a number of reasons. We need to mock, but in this case we need to mock PostModel which is a ES6 class, and not a regular function (like fetch).

The code for that would be:

```javascript
const mockSave = jest
  .spyOn(PostModel.prototype, "save")
  .mockImplementation(() => {});
const post = await createPost(title, body, tags);
expect(mockSave).toHaveBeenCalled();
```

This will mock the save function (the one we're using right now). Afterward we call the function to be tested, and check our internal `.save()` was actually called, if we need to return something, or our save is used in the function that was called, we can change the `.mockImplementation` call to return whatever we need:

```javascript
const mockSave = jest
  .spyOn(PostModel.prototype, "save")
  .mockImplementation((title, body, tags) => {
    return "this is a value";
  });
const post = await createPost(title, body, tags);
console.log(post); // this is a value
expect(mockSave).toHaveBeenCalled();
```

This can help us test the function further. In the case of static functions like `find`, `updateOne`, and others, the prototype must be removed from the spyOn, like

```javascript
.spyOn(PostModel, "updateOne")
```

We're going to go through every example for the `PostModel` usages, `createPost`, `updatePost`, `getPost`, `getLatestPost`, `deletePost`.
`createPost` was already seen in our previous example, and in this case is the only one creating a new object from `PostModel` which when spying, we add the prototype, is not the case for the others as we will see.

For `UpdatePost` we call `updateOne`, with the first parameter being the filter, and the second a partial object to update.

First we do:

```javascript
test("updatePost", async () => {
  const PartialPost = { title: "new title" };
  const id = "6758817da91ce116ad942188";
  const mockUpdate = jest
    .spyOn(PostModel, "updateOne")
    .mockImplementation((find, partial) => {
      return {
        exec: () => {},
      };
    });
  await updatePost(id, PartialPost);
  expect(mockUpdate).toHaveBeenCalledWith({ _id: id }, PartialPost);
  mockUpdate.mockRestore();
});
```

Here on SpyOn we don't use the prototype as the function being mocked is a static, we return the exec function, so the tested code can work correctly, but do not make any call to the mongo server, and after updatePost, we check that the mockUpdate has been called with specifics, getPost works exactly the same but without the partial. Our next different example is `getLatestPost`, let's see the code:

```javascript
test("getLatestPost", async () => {
  expect.assertions(2);
  const mockFind = jest.spyOn(PostModel, "find").mockImplementation((find) => {
    return {
      sort: (sortOrder) => {
        expect(sortOrder).toBe("-createdAt");
        return {
          exec: () => {},
        };
      },
    };
  });
  await getLatestPost();
  expect(mockFind).toHaveBeenCalledWith();
  mockFind.mockRestore();
});
```

This code adds a couple of interesting things first: `expect.assertions(2);` this line, will expect a specific number of assertions will be executed in this test, in this case 2, one at the bottom of the script, and another one in the callback, our second change, we can use our callback to test specifics functions being call in specific ways, this way of testing can look easy to reason about, but it creates some issues, one of them being the expects are now in different places, which makes harder to see what we're testing, we can improve this code, first, the sort function will be updated, instead of being an array function, we will create a new variable with a `jest.fn` mock that will return the exec. Then we change the mockImplementation to use this. With this we can remove `expect.assertions(2)` as our expect are not going to be in a callback or promise anymore.

```javascript
test("getLatestPost", async () => {
  let mockSort = jest.fn(() => {
    return {
      exec: () => {},
    };
  });
  const mockFind = jest.spyOn(PostModel, "find").mockImplementation((find) => {
    return {
      sort: mockSort,
    };
  });
  await getLatestPost();
  expect(mockSort).toHaveBeenCalledWith("-createdAt");
  expect(mockFind).toHaveBeenCalled();
  mockFind.mockRestore();
  mockSort.mockRestore();
});
```

This may look like a little bit more code, but is easier to reason about, as all expect can easily be found and reviewed. If for some reason you get a lot of mocks you can add them to an array and mockRestore them all in a function with a for as shown below, we can simply call `restoreMocks(mocks)`, and they will be restored

```javascript
function restoreMocks(mocks) {
  for (const mock of mocks) {
    mock.mockRestore();
  }
}
```

Our final function to be tested is `deletedPost`, but we're not going to review it, as it doesn't have any interesting features, you reader, can still go to the `/tests` directory and review any test you like. But something interesting happened twice in the `post.test.js` file, you may have missed it, as this example is super simple.

```javascript
//first test
const title = "Title of post";
const body = "Body";
const tags = ["some", "tags"];
//another test
const PartialPost = { title: "new title" };
```

In this case, we're duplicating some code, and you may duplicate some code, and that can be fine, but for testing we're going to normally create a lot of these objects, so it's better to have a little abstraction on top, to make this object creation easier, first we need to refactor `createPost`, this receives the object as different parameters, we will change it to be an object. Below we can see before and after:

```javascript
export async function createPost(title, body, tags) {
  const post = new PostModel({
    title,
    body,
    tags,
    createdAt: new Date(),
  });
  return await post.save();
}
export async function createPost({ title, body, tags, createdAt }) {
  const post = new PostModel({
    title,
    body,
    tags,
    createdAt: createdAt instanceof Date ? createdAt : new Date(),
  });
  return await post.save();
}
```

Now everything is ready for our **factory**.

### Factories

Factories, are simple function or classes, that create specific objects with defaults, so the test are easier, for our simple `PostModel` we can create a factory as such.

```javascript
function PostFactory(postPartial) {
  return {
    title: "default title",
    body: "body",
    tags: [],
    createdAt: new Date(),
    ...postPartial,
  };
}
```

This implementation, is really simple to reason about and can be good enough for your project, but have some caveats/issues that you may run into, for example, by mistake you could send undefined/null on any of the elements, and it will create an incorrect object with some of the attributes being undefined. for most cases this factory would be enough, but we can improve it, there are 2 major ways we can do this:

First. We can validate each attribute before constructing the object, and then return it like

```javascript
function postFactory(postPartial) {
  if (
    typeof postPartial.title != "string" ||
    typeof postPartial.body != "string"
  ) {
    return null; // we can also throw error, or return an error object in here it depends, on your application and your needs
  }
  // Here the object have title, and body securely, we also need to set the tags and createdAt
  //if we dont set a correct array for tags we just set it to empty, we could in change return null too.
  const tags = Array.isArray(postPartial.tags) ? postPartial.tags : [];
  const createdAt =
    postPartial instanceof Date ? postPartial.createdAt : new Date();
  return {
    title: postPartial.title,
    body: postPartial.body,
    tags: tags,
    createdAt: createdAt,
  };
}
```

As we can see, the function gets more and more complicated the more we want to ensure all the attributes are there and are correctly set. This is normal, and we would want to have it preferably in one place, in as much as possible a pure function, in this case postFactory is not a pure function as it calls `new Date()`, if we would want to solve this, we could make it a necessity to send the timestamp or string for the Date object to be created. But the point remains, with this approach, is easy to use, but when the object is big and the validations plenty, the function is going to get pretty big.

The second approach we can use that do not use validation is to delete the undefined entries we could use the `delete` keyword which is slow or map to a new object filtering undefined/null attributes

```javascript
function postFactory(partialPost) {
  let clearPartialPost = {};
  for (const [key, value] of Object.entries(partialPost)) {
    if (partialPost[key] !== undefined && partialPost[key] !== null) {
      console.log(key, value);
      clearPartialPost[key] = value;
    }
  }
  return {
    title: "default title",
    body: "body",
    tags: [],
    createdAt: new Date(),
    ...clearPartialPost,
  };
}
```

With this approach, it will clear all undefined/null so they don't get set in the final object, but you may still need to validate some or all other attributes, use any of these 2 approaches, or both at the same time.

#### Factories, Mocks and Fors

Another tactic to test several kinds of cases is to use the `test.each` function, let's see the example from jest

```javascript
test.each([
  [1, 1, 2],
  [1, 2, 3],
  [2, 1, 3],
])(".add(%i, %i)", async (a, b, expected) => {
  expect(a + b).toBe(expected);
});
```

In this example, we see, how we want to test several cases, we can leverage this by, sending some input, and our expected output, and then we test with a function, which can be very beneficial for example if we want to test our factory function works great, we send the factory with a lot of combinations and their expected output, we test them in only one place, that makes the tests more compact as we don't need 10-20 or more test functions, but let's remember to be super clear with this function, as in our coverage, and test output, we want to know exactly on what test failed, so we can exclude it, and test it on its own.

Let's change our factory function. Now, we need to do two new things: When the post is longer than `n` characters, we're going to mark it as `long`, and if not, it's going to be `short`. We're going to generate extra tags if the post contains certain words, for example, `javascript` or `jest`. We're going to add a `tech` tag to the tags.

our postFactory function will now look like this:

```javascript
function postFactory(PostPartial) {
  const newTags = [];
  if (!Array.isArray(PostPartial.tags)) PostPartial.tags = [];
  if (PostPartial.body && typeof PostPartial.body === "string") {
    if (
      PostPartial.body.includes("javascript") ||
      PostPartial.body.includes("jest")
    ) {
      newTags.push("tech");
    }
  }

  return {
    title: "default title",
    body: "body",
    tags: newTags,
    createdAt: new Date(),
    length: PostPartial?.body?.length > 20 ? "long" : "short",
    ...PostPartial,
    tags: [...PostPartial.tags, ...newTags],
  };
}
```

Now this factory is also a parser, if we remove the defaults and put other safeguards like throwing with wrong input, we can add it to our system and use it, but right now we're just gonna test, and we need to test this thoroughly.

```javascript
test.each([
  [
    postFactory({}),
    { title: "defaul title", body: "body", length: "short", tags: [] },
  ],
  [
    postFactory({ body: "this is the javascript post" }),
    {
      title: "defaul title",
      body: "this is the javascript post",
      length: "long",
      tags: ["tech"],
    },
  ],
])("PostFactory foreach test %#", async (post, expected) => {
  expect(post.body).toBe(expected.body);
  expect(post.length).toBe(expected.length);
  expect(post.tags[0]).toBe(expected.tags[0]);
});
```

We can see that we're testing 3 elements in the object, we could test all of them, we could even execute the postFactory inside the test, that would make our input array to be simpler. these these are not thorough, but, you get the point, we could add 10, 20 or 30 cases, all tested with the same function, that in this case we can now which test failed if any, by the `%#` part of the test name, this will printout the index of the array tested.
If the test we're doing are too much. probably because the array comes from a file and it's thousands of tests long, we can add the **experimental** `concurrent` attribute to test, ej: `test.concurrent.each` this will try to run the test as concurrently as possible, so, try to make the tests as pure as possible, and check other caveats at: https://jestjs.io/docs/api#testconcurrentname-fn-timeout

#### before and after

In Jest and other test runners, we have a set of functions that can be run before and after, these are: beforeEach, beforeAll, afterEach, afterAll.
These 4 functions can help us set-up mocks or variables that will work for all of our tests in the current file

### Coverage

Coverage is expected to be as high as possible, but not always 100%, not because is would not be valuable, but because a 100% coverage can be deceptive, let's see a coverage example

![Screenshot of a terminal jest test passing](./assets/coverage_1.png)

As you can see, we have some parts to go through. The first two lines are the files that we are testing and the status. In this case, both happen to pass, and we get our dopamine shot.

The next table has 6 columns: File, Percentage of Statements, Percentage of Branches, Functions, Lines being tested, and Uncovered Lines. Here we see a problem: I forgot to cover line #7.

```javascript
tags: Array.isArray(obj.tags) ? obj.tags : [],
```

In this case, I forgot to cover sending undefined, null, numbers, and strings to my function in the tags attribute. We can fix that easily with the following:

```javascript
let expected = { ... }
const postUndefined = postFactory.newPost(
    { ...expected, tags: undefined }
);
expect(Array.isArray(post.tags)).toBe(true);
```

This piece of code will try to generate a post with undefined tags, and in parsing it, we will instead generate an empty array. Cause our external API returns an undefined/null for tags when the post is not tagged with them, and our app should not break, when this happens, we parse and move on. Afterward, we test again and...

![Coverage 2 with all test passing and all lines covered](coverage_2.png)

It seems we have all of our code tested, but that's not completely true, all lines are tested but in postFactory we have this if statement

```javascript
if (obj.id && obj.title && obj.data) {
```

With this code, if we only test for one of `obj.id`, `obj.title`, or `obj.data` we will have a 100% coverage rate, but when one of these cases happens in the worst case scenario it may break our app, or simply not update the post, or shown title, etc.
We need to be careful not to trust coverage faithfully, but to use it to guide us, on how much work still needs to be done.

There are other tools to check coverage, that we're not going to check in this document, but is good for you to know them. One of them is; Sonarqube, which generates a web page with code smells, duplicates, and other metrics, saved in a db so you can check them at any time, see them with your peers, and review them.

### Tests placement

There is no big directive in javascript where your test should go, but normally is done in two ways, they have their test folder (like in this project), or they have a test file on the side of the file they are testing. Note: There are other ways in other languages like adding the test in the same file the way Rust [does it](https://doc.rust-lang.org/rust-by-example/testing/unit_testing.html), I think this would be a preferable way, as you can access private functions for testing without exporting just for testing, or trying some weird magic, but it is not available for us in JS land.

#### Option 1:

<pre>
- src
+-- item.ts
/-- util
    +-- helper.ts

- test
+-- item.test.ts
/-- util
    -- helper.test.ts
</pre>

#### Option 2:

<pre>
/ src
+-- item.ts
+-- item.test.ts
/-- util
    +-- helper.ts
    `-- helper.test.ts
</pre>

Some projects prefer Option 2, some others prefer Option 1, and the reason for this project being Option 1 is simple, I'm not doing any processing to the files, and I need to test my front-end files being served, i don't want tests to be served by the server so I won't add them to the `public` folder, I could still add them there, but it would make the next code, more complex, and error-prone.

```javascript
app.use("/public", express.static("public"));
```

This is a good technical reason why, we would want to have the test in a separate folder, it can be fixed but still, you would need to be careful, Other reasons why you may decide on test placement, are aesthetic reasons; one camp just like to have all their tests in a tidy place where it doesn't bother source code, and the other camp likes to have the unit test file alongside their source, and both are fine, both ways are ok, and if you bundle your files, there's no technical reason to go with one or another.

If the project is starting, you can have a chat with your peers and decide how you are going to handle it. If the project already exists, my suggestion would be to continue in the same way to not create unnecessary friction, so that time can be used better by creating new tests and check edge cases.

> [!NOTE]
> This section apply not only to Unit Test, but to other kinds of tests too.

### Other concerns

When we are working in the real world, I can give you some advice for your day-to-day:

#### Time for testing

how much time, should I dedicate to testing, not just unit testing, but e2e and integration, my rule of thumb is, to dedicate to test at minimum the same time you dedicated to the feature itself, if it took 2 days to develop a feature, take 2 days to create the tests.

#### When to write test

If you run into a good idea for testing a particular function; my advice is, to write it at that moment, it would probably not undermine your flow, and you will probably handle some edge cases early. Especially for pure functions, as these are the easier functions to unit test.

#### Pure functions

Try to write your functions to be "pure" as many as you can. Why? I have already said it multiple times, but it is important. **Pure functions are easier to test**—not a little bit easier, but a lot easier, so when you can make them pure easily, it's an easy win.

##### What is a pure function?

If by this point I have not explained, or you don't know what a pure function is. A pure function is one that:

1. the output is determined by the input, and nothing else. it does not check anything outside its scope to determine the output
2. does not have a side effect. Like, calling the DB, network, filesystem, current time, changes a value/object outside its scope.
3. immutability, pure functions do not change the input data, but instead create new data structures for its return.

These rules make pure functions great for caching. So as much as you can, try to make your functions pure.
