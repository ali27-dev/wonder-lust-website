const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const Listing = require("./models/listing.js");
const { title } = require("process");
const { log } = require("util");

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

////////////////////////////////////////
//////////// ROOT ROUTE ////////////////
app.get("/", (req, res) => {
  res.send("root: Hello World!");
});

////////////////////////////////////////
//////////// INDEX ROUTE////////////////
app.get("/listings", async (req, res) => {
  let listings = await Listing.find({});

  res.render("listings/index.ejs", { listings });
});
////////////////////////////////////////
///////Create: NEW & Create ROUTE///////

app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

////////////////////////////////////////
//////////// SHOW ROUTE////////////////
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  // console.log(id);
  let listId = await Listing.findById(id);
  // console.log(listId);

  res.render("listings/show.ejs", { listId });
});

///////CREATE ROUTE POST///////////
app.post("/listings", async (req, res) => {
  // let { title, description, image, price, location, country } = req.body;
  let newListings = new Listing(req.body.listings);
  console.log(newListings);

  await newListings.save();

  res.redirect("/listings");
});

////////////////////////////////////////
///////Edit: Edit & Update ROUTE///////

app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  let editListing = await Listing.findById(id);
  console.log(editListing);
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
