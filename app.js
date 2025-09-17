const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const Listing = require("./models/listing.js");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");

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
/////// Validation-For-Schema //////////
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};
const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

////////////////////////////////////////
//////////// INDEX ROUTE////////////////
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    let listing = await Listing.find({});

    res.render("listings/index.ejs", { listing });
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
    let listId = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listId });
  })
);

///////CREATE ROUTE POST///////////
app.post(
  "/listings",
  validateListing,
  wrapAsync(async (req, res, next) => {
    // let { title, description, image, price, location, country } = req.body;
    let newListings = new Listing(req.body.listing);
    // console.log(newListings);

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
    // console.log(listing);

    res.render("listings/edit.ejs", { listing });
  })
);

app.put(
  "/listings/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    // console.log(listing);

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
////////////Reviews--Post-ROUTE////////////////
app.post(
  "/listings/:id/reviews",
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("review was added");
    res.redirect(`/listings/${listing._id}`);
  })
);

////////////////////////////////////////
//////Handling-Error-Middle-wrae///////
// app.all("*", (req, res, next) => {
//   next(new ExpressError(404, "Page Not Found!"));
// });

//(The problem is that in Express 5, app.all("/.*", ...) is not valid because Express treats the string literally, not as a regex. That’s why it crashes)
//

app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  // res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
