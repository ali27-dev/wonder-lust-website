const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

// Route-listing
const listings = require("./routes/listing.js");
// Route-reviews
const reviews = require("./routes/review.js");

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

///////Listing-route
app.use("/listings", listings);
///////Review-route
app.use("/listings/:id/reviews", reviews);

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
