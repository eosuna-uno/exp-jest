import mongoose from "mongoose";

export async function connect() {
  console.log("connecting", mongoose.connect);
  return await mongoose.connect("mongodb://root:example@127.0.0.1:27017/", {
    dbName: "blogs",
  });
}
