const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/user.js");

////////// create-signUp-form///
router.get("/signup", userController.createSignupForm);

/////////// Sign-Up-logic //////
router.post("/signup", wrapAsync(userController.showSignupForm));

////////// Log-In-logic ///////
router.get("/login", userController.createLoginForm);

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.showLoginForm
);

/////////// log-Out-logic //////////
router.get("/logout", userController.logOut);

module.exports = router;
