const multer = require("multer");
// Storing user image
const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (
      req.body.name === "" ||
      req.body.email === "" ||
      req.body.password === ""
    ) {
      return cb(new Error("Please fill the remaining form credentials"), "");
    }
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    // console.log(file.destination);
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: fileStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Please upload a image of suitable format"));
    }
  },
  limits: {
    fileSize: 2 * 1024 * 1024, // 1mb
  },
});
module.exports = upload