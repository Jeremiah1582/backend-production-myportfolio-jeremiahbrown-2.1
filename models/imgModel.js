const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const creationDate = new Date();

const ImageSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  fileIdInBucket: { type: Schema.Types.ObjectId, ref: "MyImageModel" },
  fileName: String,
  image: { data: Buffer, contentType: String },
});

const MyImageModel = mongoose.model("MyImageModel", ImageSchema);

module.exports = MyImageModel;
