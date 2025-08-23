const express = require("express"); // import express
const router = express.Router(); // setup router
const upload = require("../middleware/multer"); // import multer middleware
const postsController = require("../controllers/posts");
const { ensureAuth } = require("../middleware/auth");

// Post Routes - simplified for now

router.get("/:id", ensureAuth, postsController.getPost);

// POST request --> process the image
router.post("/createPost", upload.single("file"), postsController.createPost);

// PUT request
router.put("/likePost/:id", postsController.likePost);

// DELETE request
router.delete("/deletePost/:id", postsController.deletePost);

module.exports = router;
