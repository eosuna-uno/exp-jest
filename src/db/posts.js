import mongoose from "mongoose";
import {} from "./connection.js";
const { Schema } = mongoose;

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  tags: [String],
  createdAt: Date,
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
    createdAt: new Date(),
  });
  return await post.save();
}

export async function updatePost(id, PartialPost) {
  return PostModel.updateOne({ _id: id }, PartialPost).exec();
}

export async function getPost(id) {
  return await PostModel.find({ _id: id }).exec();
}

export async function getLatestPost() {
  return await PostModel.find().sort("-createdAt").exec();
}

export async function deletePost(id) {
  PostModel.deleteOne({ _id: id }).exec();
}
