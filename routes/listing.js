const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwned, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createNewListing)
  );

///////Create: NEW & Create ROUTE///////
router.get("/new", isLoggedIn, listingController.createNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showRoute))
  .put(
    // Login-required
    isLoggedIn,
    // Implementing-Authorization
    isOwned,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwned, wrapAsync(listingController.destroyListing));

///////Edit: Edit & Update ROUTE///////
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwned,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;

// i'm srore this data for understanding the code when i'm implement the router.route then the code i'm don't understand it.//

/*
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

*/
