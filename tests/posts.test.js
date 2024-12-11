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

describe("Test posts:", () => {
  test("create post", async () => {
    const mockSave = jest
      .spyOn(PostModel.prototype, "save")
      .mockImplementation(() => {});
    const title = "Title of post";
    const body = "Body";
    const tags = ["some", "tags"];
    const post = await createPost({ title, body, tags });
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
