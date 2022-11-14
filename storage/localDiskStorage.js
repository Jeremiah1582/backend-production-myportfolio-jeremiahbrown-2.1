const multer = require("multer");

// multer file Storage configuration
const fileStorageEngine = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "/uploads");
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + "-" + file.originalname);
  },
});

exports.upload = multer({ storage: fileStorageEngine });
