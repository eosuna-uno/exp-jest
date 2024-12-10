import express from "express";
import path from "path";
import ejs from "ejs";
import {
  createPost,
  deletePost,
  getLatestPost,
  getPost,
  updatePost,
} from "./db/posts.js";
const app = express();
const port = 3000;
app.set("view engine", "ejs");
app.use("/public", express.static("public"));
app.use(express.urlencoded());
app.use(express.json());

app.post("/post", async (req, res) => {
  if (req.body.method == "PUT") {
    await updatePost(req.body.id, {
      title: req.body.title,
      body: req.body.body,
      tags: req.body.tags.split(","),
    });
    return res.redirect("/");
  }
  const post = await createPost(
    req.body.title,
    req.body.body,
    req.body.tags.split(",")
  );
  return res.redirect("/");
});
app.get("/blogs", async (req, res) => {
  const posts = await getLatestPost();
  console.log("posts", posts);
  res.send(posts);
});

app.get("/post/:id/edit", async (req, res) => {
  const post = await getPost(req.params.id);
  res.render("post/edit", post[0]);
});
app.get("/post/:id", async (req, res) => {
  res.redirect("mostrar post");
});
app.get("/post/:id/delete", async (req, res) => {
  await deletePost(req.params.id);
  return res.redirect("/");
});
app.get("/", (req, res) => {
  res.sendFile(path.join(import.meta.dirname, "../public/", "index.html"));
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
