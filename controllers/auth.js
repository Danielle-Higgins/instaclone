const passport = require("passport"); // importing passport
const validator = require("validator"); // importing validator
const User = require("../models/User"); // importing the User model

exports.getLogin = (req, res) => {
  // if the user is logged in
  if (req.user) {
    return res.redirect("/feed");
  }

  // render the login page
  res.render("login");
};

exports.getSignup = (req, res) => {
  // if the user is logged in
  if (req.user) {
    return res.redirect("/feed");
  }

  // render the signup page
  res.render("signup");
};

exports.postLogin = (req, res, next) => {
  // array of objects for any error
  const validationErrors = [];
  // console.log(req);

  // check if the email entered is valid
  if (!validator.isEmail(req.body.email)) {
    validationErrors.push({ message: "Please enter a valid email address." });
  }

  // check if password input is empty
  if (validator.isEmpty(req.body.password)) {
    validationErrors.push({ message: "Password cannot be blank." });
  }

  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    return res.redirect("/");
  }

  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  // autenticate the user
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    // if the user doesnt exist
    if (!user) {
      req.flash("errors", info);
      return res.redirect("/");
    }

    // log in the user
    req.login(user, (err) => {
      if (err) return next(err);

      req.flash("success", { message: "Success! You are logged in." });
      res.redirect(req.session.returnTo || "/feed");
    });
  })(req, res, next);
};

exports.postSignup = async (req, res, next) => {
  try {
    const validationErrors = [];
    // console.log(req.body);

    // check for valid email
    if (!validator.isEmail(req.body.email)) {
      validationErrors.push({
        message: "Please enter a valid email addresss.",
      });
    }

    // check that password is 8 characters long
    if (!validator.isLength(req.body.password, { min: 8 })) {
      validationErrors.push({
        message: "Password must be at least 8 characters long.",
      });
    }

    // make sure passwords match
    if (req.body.password !== req.body.confirmPassword) {
      validationErrors.push({ message: "Passwords do not match." });
    }

    if (validationErrors.length) {
      req.flash("errors", validationErrors);
      return res.redirect("/signup");
    }

    req.body.email = validator.normalizeEmail(req.body.email, {
      gmail_remove_dots: false,
    });

    // check if the user already exists in the database
    const existingUser = await User.findOne({
      $or: [{ email: req.body.email }, { userName: req.body.userName }],
    });

    if (existingUser) {
      req.flash("errors", {
        message: "Account with that email address or username already exists.",
      });
      res.redirect("/signup");
    }

    // create user document (new user)
    const user = new User({
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password,
    });

    await user.save(); // save our user

    // log user in after successful signup
    req.login(user, (err) => {
      if (err) return next(err);
      res.redirect("/feed");
    });
  } catch (err) {
    next(err); // pass the error to Express for handling
  }
};

exports.logout = (req, res, next) => {
  // log the user out
  req.logout((err) => {
    if (err) {
      console.log("Error logging out", err);
      return next(err);
    }

    // destroy the user session
    req.session.destroy((err) => {
      if (err) {
        console.log("Error destroying session:", err);
        return next(err);
      }

      res.clearCookie("connect.sid"); // Remove session cookie
      console.log("Session successfully destroyed. Redirecting...");
      res.redirect("/");
    });
  });
};
