const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// creating the blueprint of our documents
const UserSchema = new mongoose.Schema({
  userName: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
});

// Password hash middleware (hashing the password to store in users collection).
UserSchema.pre("save", function (next) {
  const user = this;

  // if the password property hasnt been changed
  if (!user.isModified("password")) return next();

  bcrypt.genSalt(10, (err, salt) => {
    if (err) next(err);

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

// Helper method for validating the user's password.
UserSchema.methods.comparePassword = async function comparePassword(
  candidtatePassword
) {
  try {
    return await bcrypt.compare(candidtatePassword, this.password);
  } catch (err) {
    throw err;
  }
};

// mongodb will automatically create a users collection
module.exports = mongoose.model("User", UserSchema);
