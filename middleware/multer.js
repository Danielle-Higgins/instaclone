// Multer is a node.js middleware for handling multipart/form-data , which is primarily used for uploading files

const multer = require("multer"); // import multer
const path = require("path"); // import filepath

module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);

    // specify the file extensions that are supported
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      cb(new Error("File type is not supported"), false);
      return;
    }

    cb(null, true);
  },
});
