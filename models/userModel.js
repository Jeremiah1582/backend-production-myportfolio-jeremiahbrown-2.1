const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption");
const Schema = mongoose.Schema;

const creationDate = new Date();
console.log(creationDate);

const UserSchema = new Schema({
  accountType: {
    type: String,
    default: "user",
  },
  firstName: {
    type: String,
    default: "",
  },
  lastName: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
  },
  mobile: {
    type: String,
    default: "",
  },
  location: {
    type: String,
    default: "",
  },
  socials: [
    {
      name: {
        type: String,
        default: "no social name",
      },
      img: {
        type: String,
        default: "No imgLink",
      },
      link: {
        type: String,
        default: "no link",
      },
    },
  ],

  otherWebsites: [String], //Types can be defined both ways
  profilePic: String,
  profileImg: {
    file: {
      userId: { type: Schema.Types.ObjectId, ref: "User" },
      fileId: { type: Schema.Types.ObjectId, ref: "MyImgModel" },
      fileName: { type: String, default: "profilePic" },
      image: { data: Buffer, contentType: String },
    },
  },
  password: {
    type: String,
    required: true,
  },
  signupDate: {
    type: String,
    default: creationDate,
  },
  aboutUser: {
    type: String,
    default: "",
  },
  workExperience: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "User" },
      imageLink: String,
      companyLink: String,
      startDate: String,
      endDate: String,
      companyName: String,
      position: String,
      responsibilities: String,
    },
  ],
  messagesReceived: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "User" },
      author: String,
      read: { type: Boolean, default: false },
      email: String,
      company: String,
      subject: String,
      message: String,
      dateReceived: {
        type: String,
        default: creationDate,
      },
    },
  ],

  projects: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "User" },
      projectLink: String,
      projectImg: String,
      projectName: String,
      projectDescription: String,
      projectStatus: String,
      dateOfCompletion: Date,
    },
  ],
  files: {
    cv: [{ type: mongoose.Schema.Types.ObjectId, ref: "MyFileModel" }],
    references: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        fileName: String,
        file: String,
      },
    ],
    qualifications: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        fileName: String,
        qualificationName: String,
        institutionName: String,
        file: String,
      },
    ],
  },
});

// encryption:
// UserSchema.plugin(encrypt, { secret: process.env.MONGOOSE_SECRET , encryptedFields: ["password"]}); // password field encrypted here at the schema. //hashed the password instead with md5()

const User = mongoose.model("User", UserSchema);

module.exports = User;
