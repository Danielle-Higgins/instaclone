const express = require("express"); // import express
const router = express.Router(); // setup router
const upload = require("../middleware/multer"); // import multer middleware
const postsController = require("../controllers/posts");
const { ensureAuth } = require("../middleware/auth");

// Post Routes - simplified for now

router.get("/", ensureAuth, postsController.getPost);

// process the image
router.post("/createPost", upload.single("file"), postsController.createPost);

module.exports = router;
