const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const Listing = require("./models/listing.js");
const { title } = require("process");

app.set("views", path.join(__dirname, "views"));
app.set("views engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.get("/", (req, res) => {
  res.send("root: Hello World!");
});

app.get("/litingTest", async (req, res) => {
  let apartment1 = new Listing({
    title: "Villa",
    descriuption: "on the mountain",
    price: 1200,
    location: "Kalam,swat",
    country: "Pakistan",
  });

  await apartment1.save();

  res.send("succcessful testing");
  console.log("save in DB");
});
app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
