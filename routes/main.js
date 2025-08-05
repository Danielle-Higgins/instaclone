const express = require("express"); // importing express
const router = express.Router(); // setting up router
const upload = require("../middleware/multer"); // import multer middleware
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

router.get("/profile/:id", ensureAuth, postsController.getProfile);
router.put(
  "/profile/upload",
  upload.single("file"),
  postsController.uploadProfilePic
);

router.get("/logout", authController.logout);

module.exports = router; // export router
