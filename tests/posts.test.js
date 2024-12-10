import mongoose from "mongoose";
import { createPost, PostModel, updatePost } from "./../src/db/posts";
import { jest, describe, test, expect } from "@jest/globals";

describe.only("Test posts:", () => {
  test("create post", async () => {
    const mockSave = jest
      .spyOn(PostModel.prototype, "save")
      .mockImplementation(() => {});
    const title = "Title of post";
    const body = "Body";
    const tags = ["some", "tags"];
    const post = await createPost(title, body, tags);
    expect(mockSave).toHaveBeenCalled();
    mockSave.mockRestore();
  });

  test.only("updatePost", async () => {
    const mockUpdate = jest
      .spyOn(PostModel, "updateOne")
      .mockImplementation((find, partial) => {
        console.log("find part", find, partial);
        return {
          exec: () => {
            console.log("exec");
          },
        };
      });
    await updatePost("6758817da91ce116ad942188", { title: "new title" });
    expect(1).toBe(1);
    mockUpdate.mockRestore();
  });
});
