# Test practice # 1

We can start practicing on unit testing some simple functions for example a slug generator for a given string the function to test would be

```javascript
function slugify(title) {
  let slug = title.toLocaleLowerCase();
  slug = slug.replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "-");
  return slug;
}
```

if we test this function correctly we find out that we made some mistakes 2, we need to trim the function (easy find), and we need to make sure we are actually sending a string.

```javascript
function slugify(title) {
  if (typeof title !== "string") throw new Error("Slugify needs a string");
  let slug = title.trim().toLocaleLowerCase();
  slug = slug.replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "-");
  return slug;
}
```

after this we receive a ticket to improve the function a little bit more, we can add

1. Update separator to be able to add change it to a custom one
2. add a max length or max word length, to define a max number of words or characters the slugify string should be.
3. add an extra string to add it to the end of your string (also slugify it)

We can add a config object to the function, with these new instructions, this will help the function keep being retrocompatible, and we can add these new options, also old unit test (the ones we just did), are going to help us, keep the function working as it was before we did the update.

```javascript
function slugify(title, config = {}) {
  config.separator = config.separator ?? "-";
  config.maxLength = Number.isInteger(Number(config.maxLength))
    ? Number(config.maxLength)
    : Infinity;
  config.maxWordLength = Number.isInteger(Number(config.maxWordLength))
    ? Number(config.maxWordLength)
    : Infinity;
  if (typeof title !== "string") throw new Error("Slugify needs a string");
  let slug = title.trim().toLocaleLowerCase();
  slug = slug
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, config.separator)
    .replace(/-+/g, config.separator);
  const slugged = slug;
  if (config.maxWordLength < Infinity) {
    getIndexOfWords(slug, config.separator, config.maxWordLength);
  }
  const sufixStr =
    typeof config.suffix === "string" && config.suffix.length > 0
      ? slugify(config.suffix)
      : "";
  if (config.maxLength < Infinity) {
    return slugged.substring(0, config.maxLength + 1) + sufixStr;
  } else {
    return slugged + sufixStr;
  }
}
function getIndexOfWords(str, find, expectedTimes) {
  let times = 0;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === find) {
      times++;
      if (times === expectedTimes) {
        return i;
      }
    }
  }
  return str.length;
}
```

Wow, our small `slugify` function increased a lot, but remember, old test should all works with our new function, and we should add a new bunch of tests for the new capabilities, and look at that we do have a new function `getIndexOfWords` to test, this new function is small, and can be tested throughly, kinda easy, i think we can test `str`and `find` to be `string` and `expectedTimes` is a `number`; add a couple test and then we can pass to the main function.

we could add defaults to the paramater, but still we would need to cast the parameter as numbers, other new lines in the function are to set the max length of the input string, use the new `getIndexOfWords` as cutting the string where it should belong.

# Test Practice # 2

Something that you may do a lot is, receiving information from other systems, and that includes your database, imagine you are receiving an object with the next structure

```javascript
[
  {
    user_id: "UUID",
    full_name: "string",
    date_of_birth: "string",
    address: "string",
    cp: "string",
    posts: {
      url: "/user/${UUID}/posts",
      method: "GET",
    },
    actions: {
      update: {
        url: "/user/${UUID}/edit",
        method: "PUT|PATCH|POST",
        formData: {
          method: "PUT|PATCH",
          full_name: "string",
          date_of_birth: "string",
          address: "string",
          cp: "string",
        },
      },
    },
  },
];
```

Imagine we work with this data in our application, and the API developer, decides to change the implementation slightly, for example, the developer of the API was requested to make address and cp optional, which would change the API attributes to be `undefined|string` instead of just `string`, if we have used this attributes in our application, and receive an `undefined` instead of a string, that would most likely break our application. These kinds of changes do not normally happen in mature applications but may happen more often in new ones being developed. And something we can do to make sure this doesn't happen to us is, **transform** or **parse** our inputs. In this case, we want to add two changes, first, our application needs to know if the user is an adult, and we need to generate a version of the name of the person of 2 or 3 letters, we want to parse the information so we know is correct, you can use Zod, Valibot or another schema library to validate the input, but we will do it by hand this time, just for learning purposes. This will help us, with unexpected changes, it will not permit the data to go through the system, and we can show an error UI to the front end, and send an email or another notification to us. This will make our application much more resilient to changes.

Let's start with the function, in this case if the object cannot be parse we're going to throw an `Error`:

```javascript
function parseUser(object) {
  if (typeof object.user_id !== "string" || object.user_id.length !== 36) {
    throw new Error("UserId is not a valid uuid");
  }
  let adulthood = "minor";
  const years = getYearsSince(new Date(object.date_of_birth), new Date());
  if (years > 18) adulthood = "adult";

  return {
    userId: object.user_id,
    fullName: object.full_name,
    dateOfBirth: object.date_of_birth,
    adulthood: adulthood,
    iconName: getIconName(object.full_name),
    address: object.address,
    cp: object.cp,
    posts: object.posts,
    actions: object.actions,
  };
}
function getYearsSince(birthDate, currentDate = new Date()) {
  if (!(birthDate instanceof Date) || !(currentDate instanceof Date))
    throw new TypeError("birthDate and currentDate should be type Date");
  var ageDif = currentDate.getTime() - birthdate.getTime();
  const agedate = new Date(ageDif);
  const years = Math.abs(ageDate.getUTCFullYear() - 1970);
  return years;
}
function getIconName(name) {
  if (typeof name !== "string") {
    throw Error("getIconName attribute name is not a string");
  }
  const splitted = name.split(" ");
  switch (splitted.length) {
    case 1:
      if (splitted[0].length > 0) {
        return splitted[0][0] + splitted[0][1];
      } else {
        return splitted[0][0];
      }
    case 2:
      return splitted[0][0] + splitted[1][0];
  }
  return splitted[0] + splitted[2][0];
}
```

if you note, we're using currentDate as an input, and do not call `new Date()` on the body, as that would make this function impure and harder to test, you can try it.
we leave posts and actions without changes intentionally as the values from the service for the moment are not going to be use in our application, but the moment we need them, we should add another function to parse/validate those.

now we need to check what we did, we now have 40 lines, and 3 functions to test, let's dissect the anatomy of the functions we have created so far,

```javascript
function parseUser(object) {
  //First we have the validation state, here, we expect the input to be of some specific type, this parts guardrails the developer in using the correct types, and values
  if (typeof object.user_id !== "string" || object.user_id.length !== 36) {
    throw new Error("UserId is not a valid uuid");
    // in some cases, its ok to throw, in other cases you would prefer to return, null, or another type, that depends on your specific usecase
  }

  //Now we see the body this is usually where the transformation happens
  let adulthood = "minor";
  const years = getYearsSince(new Date(object.date_of_birth), new Date());
  if (years > 18) adulthood = "adult";
  /*in this case we have a hidden ENUM that is adulthood can only be 2 values "minor" and "adult".
   if you have typescript available in your project, you should type adulthood accordingly, not with the ENUM, but with the union `type adulthood = "minor" | "adult"` or with jsdoc @typedef {"minor" | "adult"}
  */

 //return, where we create our return object, with the input, and the calculated values.
  return {
    userId: object.user_id,
    ...
    iconName: getIconName(object.full_name), // we do a transformation on return statement, because it's simple/easy enough, if you see a ternary operator, i would suggest to move the transformation to the top
    ...
    posts: object.posts,
    actions: object.actions,
  };
}
```

And thats how basically all parser/validators look like.
now we need to create the tests for this 3 functions, the order I would suggest to be from the deepest function, to the outer, if our function has a dependancy on another function, we should create the tests for that one first, in this case: getIconName and getYearsSince go first, then parseUser.

That would be a practice for the reader to finish.
