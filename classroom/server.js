const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");

/////GET-USER////
app.use("/user", users);

////GET-POSTS////
app.use("/post", posts);

app.listen("3030", () => {
  console.log("server is statr on port 3030");
});
