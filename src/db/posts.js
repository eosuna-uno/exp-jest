import mongoose from "mongoose";
import { connection } from "./connection.js";
import { randomUUID } from "node:crypto";
const { Schema } = mongoose;

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  id: { type: Schema.Types.UUID, required: true },
  tags: [String],
});

export const PostModel = mongoose.model("post", PostSchema);

/**
 * Creates a post with a partial, and returns a new post from mongo
 * @param {string} title Title of the post
 * @param {string} body Information in the post
 * @param {string[]} tags Tags related to the post
 * @throws Error
 */
export async function createPost(title, body, tags) {
  const post = new PostModel({
    title,
    body,
    tags,
    id: randomUUID(),
  });
  return await post.save();
}
