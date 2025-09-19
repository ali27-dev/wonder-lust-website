const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");

////////////////////////////////////////
/////// Validation-For-Schema //////////
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, error);
  } else {
    next();
  }
};
////////////////////////////////////////
//////////// INDEX ROUTE////////////////
router.get(
  "/",
  wrapAsync(async (req, res) => {
    let listing = await Listing.find({});
    res.render("listings/index.ejs", { listing });
  })
);
////////////////////////////////////////
///////Create: NEW & Create ROUTE///////

router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

////////////////////////////////////////
//////////// SHOW ROUTE////////////////
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listId = await Listing.findById(id).populate("reviews");
    if (!listId) {
      req.flash("error", "Listing does not exits!");
      return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listId });
  })
);

///////CREATE ROUTE POST///////////
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res, next) => {
    // let { title, description, image, price, location, country } = req.body;
    let newListings = new Listing(req.body.listing);
    await newListings.save();
    req.flash("success", "New Listing created!");
    res.redirect("/listings");
  })
);

////////////////////////////////////////
///////Edit: Edit & Update ROUTE///////

router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing does not exits!");
      return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  })
);

router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    // console.log(listing);

    await listing.save();
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  })
);

////////////////////////////////////////
////////////DELETE ROUTE////////////////
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
  })
);

module.exports = router;
