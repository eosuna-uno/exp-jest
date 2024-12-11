import mongoose from "mongoose";
const { Schema } = mongoose;
const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  tags: [String],
  createdAt: Date,
});

export const PostModel = mongoose.model("post", PostSchema);

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
export async function createPost({ title, body, tags, createdAt }) {
  const post = new PostModel({
    title,
    body,
    tags,
    createdAt: createdAt instanceof Date ? createdAt : new Date(),
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
