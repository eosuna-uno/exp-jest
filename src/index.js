import express from "express";
import path from "path";
const app = express();
const port = 3000;

app.use("/public", express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(import.meta.dirname, "../public/", "index.html"));
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
