// // INIT GRIDFS STORAGE ENGINE 1
const crypto = require("crypto");
const path = require("path");
const { GridFsStorage } = require("multer-gridfs-storage");
const multer = require("multer");
const mongoURI = process.env.DB_LINK + process.env.DB_NAME;

const storage = new GridFsStorage({
  url: mongoURI,
  file: async (req, file) => {
    // console.log("this is req ", req, "in gridfs Storage...", file);
    return await new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          console.log("DBUpload: request rejected ....", err);
          return reject(err);
        }

        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        };

        resolve(fileInfo);
      });
    });
  },
});

exports.upload = multer({ storage: storage });
