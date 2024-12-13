import mongoose from "mongoose";
import {
  createPost,
  deletePost,
  getLatestPost,
  getPost,
  PostModel,
  updatePost,
} from "./../src/db/posts";
import { jest, describe, test, expect } from "@jest/globals";
/**
 *
 * @param {Object} post
 * @param {string} post.title
 * @param {string} post.body
 * @param {string[]} post.tags
 * @param {Date|undefined} post.createdAt
 * @throws {Error}
 * @returns
 */
function postFactory(PostPartial) {
  const newTags = [];
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

describe("Test posts:", () => {
  test("create post", async () => {
    const mockSave = jest
      .spyOn(PostModel.prototype, "save")
      .mockImplementation(() => {});
    const postCreated = postFactory({
      title: "Title of post",
      body: "Body",
      tags: ["some", "tags"],
    });
    const post = await createPost(postCreated);
    expect(mockSave).toHaveBeenCalled();
    mockSave.mockRestore();
  });

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
  test("getPost", async () => {
    const id = "6758817da91ce116ad942188";
    const mockGetPost = jest
      .spyOn(PostModel, "find")
      .mockImplementation((find) => {
        return {
          exec: () => {},
        };
      });
    await getPost("6758817da91ce116ad942188");
    expect(mockGetPost).toHaveBeenCalledWith({ _id: id });
    mockGetPost.mockRestore();
  });
  test("getLatestPost", async () => {
    let mockSort = jest.fn(() => {
      return {
        exec: () => {},
      };
    });
    const mockFind = jest
      .spyOn(PostModel, "find")
      .mockImplementation((find) => {
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
  test("deletePost", async () => {
    const id = "6758817da91ce116ad942188";
    const mockDeletePost = jest
      .spyOn(PostModel, "deleteOne")
      .mockImplementation((find) => {
        return {
          exec: () => {},
        };
      });
    await deletePost("6758817da91ce116ad942188");
    expect(mockDeletePost).toHaveBeenCalledWith({ _id: id });
    mockDeletePost.mockRestore();
  });
});
