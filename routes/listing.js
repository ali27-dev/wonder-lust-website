const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwned, validateListing } = require("../middleware.js");
const { authorize } = require("passport");

const listingController = require("../controllers/listing.js");

//////////// INDEX ROUTE////////////////
router.get("/", wrapAsync(listingController.index));

///////Create: NEW & Create ROUTE///////
router.get("/new", isLoggedIn, listingController.createNewForm);

//////////// SHOW ROUTE////////////////
router.get("/:id", wrapAsync(listingController.showRoute));

///////CREATE ROUTE POST///////////
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(listingController.createNewListing)
);

///////Edit: Edit & Update ROUTE///////

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwned,
  wrapAsync(listingController.createEditForm)
);
//////Update ROUTE///////
router.put(
  "/:id",
  // Login-required
  isLoggedIn,
  // Implementing-Authorization
  isOwned,
  validateListing,
  wrapAsync(listingController.updateListing)
);

////////////DELETE ROUTE////////////////
router.delete(
  "/:id",
  isLoggedIn,
  isOwned,
  wrapAsync(listingController.destroyListing)
);

module.exports = router;
