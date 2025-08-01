const mongoose = require("mongoose"); // import mongoose

/**
 * THINGS TO ADD IN THE FUTURE:
 * number of likes
 */

const CommentSchema = new mongoose.Schema({
  comment: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Comment", CommentSchema); // export the model
