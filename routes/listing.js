const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwned, validateListing } = require("../middleware.js");
const { authorize } = require("passport");

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

router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

////////////////////////////////////////
//////////// SHOW ROUTE////////////////
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listId = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");
    console.log(listId);
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
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res, next) => {
    // let { title, description, image, price, location, country } = req.body;
    let newListings = new Listing(req.body.listing);
    newListings.owner = req.user._id;
    await newListings.save();
    req.flash("success", "New Listing created!");
    res.redirect("/listings");
  })
);

////////////////////////////////////////
///////Edit: Edit & Update ROUTE///////

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwned,
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
//////Update ROUTE///////
router.put(
  "/:id",
  // Login-required
  isLoggedIn,
  // Implementing-Authorization
  isOwned,
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;

    await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    await listing.save();
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  })
);

////////////////////////////////////////
////////////DELETE ROUTE////////////////
router.delete(
  "/:id",
  isLoggedIn,
  isOwned,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
  })
);

module.exports = router;
