const User = require("../models/userModel");
const MyFileModel = require("../models/fileModel");
const MyImageModel = require("../models/imgModel");
const { bucket } = require("../db/mongoDBConnection");

//WORKEXP FUNCTIONS

//1 CREATE - addWorkExp--------------------
exports.addWorkExp = (req, res) => {
  console.log("addworkExp function fired... ", req.body);

  const { userId, workExp } = req.body;
  // !cant use finByIdAndUpdate here, it lets us add 1 obj and then next obj we add overwrites the first
  User.findByIdAndUpdate(
    userId,
    { $push: { workExperience: workExp } },
    (err, result) => {
      if (err) {
        throw err;
      } else if (result) {
        res.status(200).json({ msg: "Work Experience saved", result });
      } else {
        res.send("nothing was returned");
      }
    }
  );
  return res.status(400);
};
//2 UPDATE NESTED ARRAY IN MONGO Doc,workExperience Array-------
exports.updateWorkExp = (req, res) => {
  const itemId = req.body.changedState.itemId;
  const userId = req.body.changedState.userId;
  console.log(" req.body  changedState...", req.body);
  const updatedWrkExp = {
    imageLink: req.body.changedState.imageLink,
    companyLink: req.body.changedState.companyLink,
    startDate: req.body.changedState.startDate,
    endDate: req.body.changedState.endDate,
    companyName: req.body.changedState.companyName,
    position: req.body.changedState.position,
    responsibilities: req.body.changedState.responsibilities,
  };

  console.log("updatedWrkExp is..", updatedWrkExp);

  User.updateOne(
    { _id: userId, "workExperience._id": itemId }, // query
    { $set: { "workExperience.$": updatedWrkExp } } // update
  ).then((result) => {
    if (result) {
      console.log("successful update wrkexp");
      res.json({ msg: "update successful " });
    } else {
      console.log("no result");
      res.json({ msg: "update failed " });
    }
  });
};
//3 REMOVE Document-------------------
exports.removeWorkExp = async (req, res) => {
  console.log("removeWrk Exp...", req.body);
  User.findByIdAndUpdate(
    req.body.userId,
    { $pull: { workExperience: { _id: req.body.itemId } } },
    async (err, result) => {
      console.log("item id", req.body);
      if (err) {
        console.log("error deleting the item form workExperience Array", err);
      } else if (result) {
        console.log("this is the result from WrkExperience Array", result);
      }
      console.log(err, result);
    }
  );
  await res.status(200).json({ msg: "Deleted! refresh page to see changes" });
};
// --REmove Msg
exports.removeMsg = async (req, res) => {
  console.log("removeMsg Exp...", req.body);
  User.findByIdAndUpdate(
    req.body.userId,
    { $pull: { messagesReceived: { _id: req.body.itemId } } },
    async (err, result) => {
      console.log("item id", req.body);
      if (err) {
        console.log("error deleting the item form messagesReceived Array", err);
      } else if (result) {
        console.log("this is the result from messagesReceived Array", result);
      }
      console.log(err, result);
    }
  );
  await res.status(200).json({ msg: "Deleted! refresh page to see changes" });
};

//Edit User info
exports.editUserInfo = (req, res) => {
  const changes = req.body.update;
  const id = req.body.update._id;
  console.log("editUser req.body...", req.body);

  User.findByIdAndUpdate(id, changes, async function (err, data) {
    await data;
    if (err) {
      throw err;
    }
    if (!data) {
      console.log(
        "adminController: there was no data returned and no error msg ",
        data
      );
    } else if (data) {
      res.status(200).json({ result: data, msg: "user info was updated" });
    }
  });
};

exports.markMsgRead = (req, res) => {
  console.log("this is read...", req.body);
  const change = req.body.read;
  const userId = req.body.userId;
  const itemId = req.body.itemId;

  User.updateOne(
    { _id: userId, "messagesReceived._id": itemId },
    { $set: { "messagesReceived.$.read": change } }
  ).then((doc) => {
    console.log("update read is ....", doc);
    res.status(200).json(doc);
  });
};
// upload files
exports.uploadFile = async (req, res) => {
  console.log("upload function fired,");
  const userId = req.session.jwtPayload.userId;
  const { file } = await req;
  const { id } = file;
  console.log("file is...", file);

  //Save to imageModal
  const newFile = new MyFileModel({
    idInBucket: id,
    userId: userId,
    fileName: file.originalname,
    mimetype: file.memetype,
    contentType: file.contentType,
    file: file,
  });
  newFile.save().then(() => {
    // add file to user
    User.findByIdAndUpdate(userId, {
      $push: { "files.cv": newFile.idInBucket },
    }).then((result) => {
      console.log("file uploaded..");
      res.status(200).json(id);
    });
  });
};
//upload profile Pic

exports.uploadProfilePic = async (req, res) => {
  if (req.file) {
    const newFile = await req.file;
    const { userId } = req.session.jwtPayload;
    const newFileId = req.file.id;
    console.log("X ...", newFile, userId, newFileId);
    console.log("the uploadprofpic...", req);

    // DELETE OLD file from MyImageFiles!!!
    MyImageModel.find({}).then(async (doc) => {
      console.log("upload Prof Pic...", doc);
      if (doc[0]) {
        console.log("myImageModel files....", doc);
        const oldFileId = doc[0]._id;
        const oldFileIdInBucket = doc[0].fileIdInBucket;

        // Delete from Bucket
        bucket.delete(oldFileIdInBucket).then((delDoc) => {
          console.log("file deleted from BUCKET");
        });
        // Delete from MyImageModel
        MyImageModel.deleteOne({ _id: oldFileId }).then((delDoc) => {
          console.log("file was deleted....", delDoc);
          // ADD new FILE ...
          const newProfilePic = new MyImageModel({
            userId: userId,
            fileIdInBucket: newFileId,
            fileName: "profilePic",
            image: newFile,
          });
          console.log("if newProfilePic...", newProfilePic);
          newProfilePic.save().then((result) => {
            res.status(200).json(result);
          });
        });
      } else {
        console.log("part 3 of func ...");
        const newProfilePic = new MyImageModel({
          userId: userId,
          fileIdInBucket: newFileId,
          fileName: "profilePic",
          image: newFile,
        });
        console.log("else newProfilePic...", newProfilePic);
        newProfilePic.save().then((result) => {
          res.status(200).json(result);
        });
      }
    });
  } else {
    res.status(200).json({ msg: "submit an image" });
  }

  //     console.log("AC: newProfilePic is .....", newProfilePic);
  //
  //     console.log('AC: uploadProfilePic result!....',result)

  // });
};
