const User = require("../models/user.js");

//////// create-signUp-form/////
module.exports.createSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};
/////////// Sign-Up-logic //////
module.exports.showSignupForm = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let newuser = new User({ username, email });
    const registerUser = await User.register(newuser, password);
    console.log(registerUser);
    // default-login-when sign-up then direct log-in//
    req.login(registerUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "welcome to wonderlust");
      res.redirect("/listings");
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/signup");
  }
};

////////// Log-In-Form ///////
module.exports.createLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

////////// Log-In-Logic ///////
module.exports.showLoginForm = async (req, res) => {
  req.flash("success", "Welcome back to wonderlust");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

/////////// log-Out-logic //////////
module.exports.logOut = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Your successfully Logged out");
    res.redirect("/listings");
  });
};
