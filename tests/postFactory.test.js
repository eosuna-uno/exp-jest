//const postFactory = require("../public/fe-app/postFactory");
import * as postFactory from "./../public/fe-app/postFactory";
import { jest, describe } from "@jest/globals";
describe("postParser test:", () => {
  test("parse post without tags", () => {
    let expected = { id: 1, title: "title", data: "some post data" };
    const post = postFactory.newPost(expected);
    expected.tags = [];
    for (const [key, value] of Object.entries(post)) {
      expect(post[key].value).toBe(expected[key].value);
    }
    /*
    expect(post).toBe({
      id: 1,
      title: "title",
      data: "some post data",
      tags: [],
    });*/ //this serializes which is not great, the order of attributes may be wrong
  });
  test("parse post without a needed key", () => {
    let expectedNoTitle = { id: 1, data: "some post data" };
    let expectedNoId = { title: "title", data: "some post data" };
    let expectedNoData = { id: 1, title: "some title" };
    const postNoData = postFactory.newPost(expectedNoData);
    const postNoId = postFactory.newPost(expectedNoId);
    const postNoTitle = postFactory.newPost(expectedNoTitle);
    expect(postNoData).toBe(null);
    expect(postNoId).toBe(null);
    expect(postNoTitle).toBe(null);
  });
  test.skip("parse post with some tags", () => {
    let expected = {
      id: 1,
      title: "title",
      data: "some post data",
      tags: ["example tags"],
    };
    const post = postFactory.newPost(expected);
    expect(post.tags[0]).toBe("example tags");
  });
  test.skip("parse post with undefined or null tag", () => {
    let expected = {
      id: 1,
      title: "title",
      data: "some post data",
      tags: null,
    };
    const post = postFactory.newPost(expected);
    const postUndefined = postFactory.newPost({ ...expected, tags: undefined });
    expect(Array.isArray(post.tags)).toBe(true);
    expect(Array.isArray(postUndefined.tags)).toBe(true);
  });
});
