const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User"); // import User model

module.exports = function (passport) {
  // using local strategy to login (authenticate user) using email and password
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          // find user by their email
          const user = await User.findOne({ email: email.toLowerCase() });

          // if the user doesnt exist
          if (!user) {
            return done(null, false, { message: `Email ${email} not found` });
          }

          // checking if password exists
          if (!user.password) {
            return done(null, false, {
              message:
                "Your account was registered using a sign-in provider. To enable password login, sign in using a provider, and then set a password under your user profile.",
            });
          }

          // comparing the password entered with the hashed password in DB
          const isMatch = await user.comparePassword(password);

          // if authentication succeeds (passwords match): Pass the user object.
          if (isMatch) return done(null, user);

          // if authentication fails: Pass false with a message.
          return done(null, false, { message: "Invalid email or password." });
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  // after a successful login, Passport serializes the user’s ID into the session (so they remain logged in).
  passport.serializeUser((user, done) => done(null, user.id));

  // when the user makes a new request, Passport retrieves the session and calls deserializeUser
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
