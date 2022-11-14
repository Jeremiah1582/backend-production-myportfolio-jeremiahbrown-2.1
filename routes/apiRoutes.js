const router = require("express").Router();
const mongoose = require("mongoose");
const { bucket } = require("../db/mongoDBConnection");

//function for get uploaded Image from the database using GridFS
router.get("/getCV/:id", ({ params: { id } }, res) => {
  if (id) {
    const _id = new mongoose.Types.ObjectId(id);
    bucket.openDownloadStream(_id).pipe(res);
  }
});
router.get("/getProfilePic/:id", ({ params: { id } }, res) => {
  if (id) {
    console.log(id);
    const _id = new mongoose.Types.ObjectId(id);
    bucket.openDownloadStream(_id).pipe(res);
  }
});

module.exports = router;
