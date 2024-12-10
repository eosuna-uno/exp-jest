import mongoose from "mongoose";

export const connection = await mongoose.connect(
  "mongodb://root:example@127.0.0.1:27017/",
  { dbName: "blogs" }
);
