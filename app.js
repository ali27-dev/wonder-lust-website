const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const Listing = require("./models/listing.js");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

app.set("views", path.join(__dirname, "views"));
app.set("views engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

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
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    if (!req.body.listing) {
      throw new ExpressError(400, "Send a valid data for lasting");
    }
    let listings = await Listing.find({});

    res.render("listings/index.ejs", { listings });
  })
);
////////////////////////////////////////
///////Create: NEW & Create ROUTE///////

app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

////////////////////////////////////////
//////////// SHOW ROUTE////////////////
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    // console.log(id);
    let listId = await Listing.findById(id);
    // console.log(listId);

    res.render("listings/show.ejs", { listId });
  })
);

///////CREATE ROUTE POST///////////
app.post(
  "/listings",
  wrapAsync(async (req, res) => {
    if (!req.body.listing) {
      throw new ExpressError(400, "Send a valid data for lasting");
    }
    // let { title, description, image, price, location, country } = req.body;
    let newListings = new Listing(req.body.listings);
    console.log(newListings);

    await newListings.save();

    res.redirect("/listings");
  })
);

////////////////////////////////////////
///////Edit: Edit & Update ROUTE///////

app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    console.log(listing);

    res.render("listings/edit.ejs", { listing });
  })
);

app.put(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    if (!req.body.listing) {
      throw new ExpressError(400, "Send a valid data for lasting");
    }
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listings });
    console.log(listing);

    await listing.save();
    res.redirect(`/listings/${id}`);
  })
);

////////////////////////////////////////
////////////DELETE ROUTE////////////////
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndDelete(id);

    res.redirect("/listings");
  })
);

////////////////////////////////////////
//////Handling-Error-Middle-wrae///////
// app.all("*", (req, res, next) => {
//   next(new ExpressError(404, "Page Not Found!"));
// });

//(The problem is that in Express 5, app.all("/.*", ...) is not valid because Express treats the string literally, not as a regex. That’s why it crashes)
//

app.all(/.*/, (req, res) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  // res.status(statusCode).send(message);
  res.render("error.ejs", { message });
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
