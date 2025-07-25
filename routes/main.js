const express = require("express"); // importing express
const router = express.Router(); // setting up router
const authController = require("../controllers/auth"); // import auth controller
const postsController = require("../controllers/posts");
const { ensureAuth } = require("../middleware/auth");

// Main Routes - simplified for now

// get request to main root (login page)
router.get("/", authController.getLogin);
router.post("/login", authController.postLogin);

router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);

router.get("/feed", ensureAuth, postsController.getFeed);

router.get("/profile", ensureAuth, postsController.getProfile);

router.get("/logout", authController.logout);

module.exports = router; // export router
