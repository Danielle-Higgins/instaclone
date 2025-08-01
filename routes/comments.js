const express = require("express"); // import express
const router = express.Router(); // setup router
const commentsController = require("../controllers/comments");

router.post("/createComment/:id", commentsController.createComment);

module.exports = router;
