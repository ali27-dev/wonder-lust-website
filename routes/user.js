const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/user.js");

router
  .route("/signup")
  .get(userController.createSignupForm)
  .post(wrapAsync(userController.showSignupForm));

router
  .route("/login")
  .get(userController.createLoginForm)
  .post(
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

// i'm srore this data for understanding the code when i'm implement the router.route then the code i'm don't understand it.//

/*
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

*/
