const express = require("express");
const app = express();
const port = 3000;
const path = require("path");

app.use("/public", express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/", "index.html"));
});

app.get("/blogs", (req, res) => {
  res.send([
    {
      id: 1,
      title: "my jests tsts",
      body: "check all my jests tests",
    },
  ]);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
