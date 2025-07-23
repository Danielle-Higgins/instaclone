module.exports = {
  // make sure the user is logged in in order to access certain routes
  ensureAuth: function (req, res, next) {
    // check if your authenticated (if they are logged in)
    if (req.isAuthenticated()) {
      return next(); // move on (keep going)
    } else {
      res.redirect("/"); // take user back to main page
    }
  },
};
