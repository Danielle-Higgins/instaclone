// import cloudinary middleware
const cloudinary = require("../middleware/cloudinary");

const User = require("../models/User");
const Post = require("../models/Post"); // import Post model
const Comment = require("../models/Comment");

module.exports = {
  getFeed: async (req, res) => {
    try {
      // gets the plan objs (documents have more to them than objs)
      // grab all the posts and the user who made it
      const posts = await Post.find()
        .sort({ createdAt: "desc" })
        .populate("user", "userName profileImg")
        .lean();

      const numOfPosts = await Post.countDocuments({ user: req.user.id });

      res.render("feed", {
        posts: posts,
        user: req.user,
        numOfPosts: numOfPosts,
      });
    } catch (err) {
      console.error(err);
    }
  },

  getProfile: async (req, res) => {
    try {
      // grab the user profile info based on id in url
      const user = await User.findById(req.params.id);

      // get posts of the user with the id in the url
      const posts = await Post.find({ user: req.params.id })
        .sort({ createdAt: "desc" })
        .populate("user", "userName");

      const numPosts = await Post.countDocuments({ user: req.params.id });

      // number of logged in users posts
      const numOfPosts = await Post.countDocuments({ user: req.user.id });

      res.render("profile", {
        posts: posts,
        userProfile: user,
        user: req.user,
        numPosts: numPosts,
        numOfPosts: numOfPosts,
      });
    } catch (err) {
      console.error(err);
    }
  },

  getPost: async (req, res) => {
    try {
      // grab the post by its id from the url using query parameters
      const post = await Post.findById(req.params.id).populate(
        "user",
        "userName profileImg"
      );

      // set the number of comments the post has
      post.comments = await Comment.countDocuments({
        post: req.params.id,
      });

      await post.save();

      const numOfPosts = await Post.countDocuments({ user: req.user.id });

      // grab the comments of the post
      const comments = await Comment.find({ post: req.params.id })
        .populate("user", "profileImg")
        .lean();

      res.render("post", {
        post: post,
        user: req.user,
        numOfPosts: numOfPosts,
        comments: comments,
      });
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

  likePost: async (req, res) => {
    try {
      // Find post by id
      const post = await Post.findById({ _id: req.params.id });

      // check if user id is stored in the array
      const alreadyLiked = post.likedBy.includes(req.user.id);

      // unlike post
      if (alreadyLiked) {
        post.likedBy.splice(post.likedBy.indexOf(req.user.id), 1);
        post.likes -= 1;
      } else {
        // like post
        post.likedBy.push(req.user.id);
        post.likes += 1;
      }

      // save changes to db
      await post.save();

      // respond back to client
      res.json({ likes: post.likes, liked: !alreadyLiked });
    } catch (err) {
      console.error(err);
    }
  },

  deletePost: async (req, res) => {
    try {
      // Find post by id
      const post = await Post.findById({ _id: req.params.id });

      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);

      // Delete post from db
      await Post.findByIdAndDelete({ _id: req.params.id });

      // Delete the comments under the post
      await Comment.deleteMany({ post: req.params.id });

      console.log("Deleted Post");
      res.redirect(`/profile/${post.user}`);
    } catch (err) {
      console.error(err);
    }
  },

  uploadProfilePic: async (req, res) => {
    try {
      // upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      // update the users profile image in db
      await User.findByIdAndUpdate(req.user.id, {
        profileImg: result.secure_url,
        cloudinaryId: result.public_id,
      });

      res.redirect(`/profile/${req.user.id}`); // refresh
    } catch (err) {
      console.error(err);
    }
  },
};
