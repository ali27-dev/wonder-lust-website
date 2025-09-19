const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("views", path.join(__dirname, "views"));
app.set("views engine", "ejs");

const sessionOptions = {
  secret: "mysupersecretstring",
  resave: false,
  saveUninitialized: true,
};

app.use(session(sessionOptions));
app.use(flash());
app.use((req, res, next) => {
  res.locals.successMsg = req.flash("success");
  res.locals.erorrMsg = req.flash("error");
  next();
});
app.get("/register", (req, res) => {
  let { name = "anonymous" } = req.query;
  req.session.name = name;
  if (name === "anonymous") {
    req.flash("error", "user Not registered");
  } else {
    req.flash("success", "user registered successfully");
  }

  res.redirect("/hello");
});

app.get("/hello", (req, res) => {
  res.render("page.ejs", {
    name: req.session.name,
  });
});
// app.get("/sessioncounter", (req, res) => {
//   if (req.session.count) {
//     req.session.count++;
//   } else {
//     req.session.count = 1;
//   }
//   res.send(`you send a request ${req.session.count}`);
// });
app.listen("3030", () => {
  console.log("server is statr on port 3030");
});

// // app.use(cookieParser());
// app.use(cookieParser("secretcode"));

// app.get("/getsignedcookie", (req, res) => {
//   res.cookie("made-in", "Pakistan", { signed: true });
//   res.send("cookies is added");
// });

// app.get("/verify", (req, res) => {
//   console.dir(req.signedCookies);
//   res.send("verified");
// });

// app.get("/getcookie", (req, res) => {
//   res.cookie("greet", "hello");
//   res.cookie("madeIn", "Pakistan");
//   res.send("we are sent cookies");
// });

// app.get("/", (req, res) => {
//   console.dir(req.cookies);
//   res.send("root: Hello World!");
// });
// /////GET-USER////
// app.use("/user", users);

// ////GET-POSTS////
// app.use("/post", posts);
