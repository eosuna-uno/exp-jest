import { describe, test, expect, it } from "@jest/globals";

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
