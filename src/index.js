import express from "express";
import path from "path";
import { createPost } from "./db/posts.js";
const app = express();
const port = 3000;

app.use("/public", express.static("public"));
app.use(express.urlencoded());
app.use(express.json());

app.post("/post", async (req, res) => {
  console.log(req.body);
  const post = await createPost(
    req.body.title,
    req.body.body,
    req.body.tags.split(",")
  );
  res.send(post);
});
app.get("/blogs", (req, res) => {
  res.send([
    {
      id: 1,
      title: "my jests tsts",
      body: "check all my jests tests",
      tags: ["jest", "javascript"],
    },
  ]);
});
app.get("/", (req, res) => {
  res.sendFile(path.join(import.meta.dirname, "../public/", "index.html"));
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
