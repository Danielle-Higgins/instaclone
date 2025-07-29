const express = require("express"); // import express
const router = express.Router(); // setup router
const postsController = require("../controllers/posts");
const { ensureAuth } = require("../middleware/auth");

// Post Routes - simplified for now
router.get("/", ensureAuth, postsController.getPost);

module.exports = router;
