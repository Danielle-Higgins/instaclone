// import cloudinary middleware
const cloudinary = require("../middleware/cloudinary");

const Post = require("../models/Post"); // import Post model
// TODO: import comment model

module.exports = {
  getFeed: async (req, res) => {
    try {
      // gets the plan objs (documents have more to them than objs)
      // grab all the posts and the user who made it
      const posts = await Post.find()
        .sort({ createdAt: "desc" })
        .populate("user", "userName")
        .lean();

      res.render("feed", { posts: posts });
    } catch (err) {
      console.error(err);
    }
  },

  getProfile: async (req, res) => {
    try {
      res.render("profile");
    } catch (err) {
      console.error(err);
    }
  },

  getPost: async (req, res) => {
    try {
      // grab the post by its id from the url using query parameters
      const post = await Post.findById(req.params.id).populate(
        "user",
        "userName"
      );

      res.render("post", { post: post, user: req.user });
    } catch (err) {
      console.error(err);
    }
  },

  createPost: async (req, res) => {
    try {
      // upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      // create our post document
      await Post.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        likes: 0,
        comments: 0,
        user: req.user.id,
      });

      console.log("Post has been added!");
      res.redirect("/feed"); // take user to feed page
    } catch (err) {
      console.error(err);
    }
  },
};
