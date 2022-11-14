const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FileSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  idInBucket: { type: Schema.Types.ObjectId, ref: "MyFileModel" },
  fileName: { type: String, default: "this is a file" },
  file: { data: Buffer, contentType: String },
});

const MyFileModel = mongoose.model("MyFileModel", FileSchema);
module.exports = MyFileModel;
