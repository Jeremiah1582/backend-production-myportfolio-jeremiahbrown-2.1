const router = require("express").Router();
const adminController = require("../controllers/adminController");
const { upload } = require("../db/storage/gridFS");

router.get("/test", () => {
  console.log("/admin/test  fired");
});

router.post("/editUserInfo", adminController.editUserInfo);
router.post("/addWorkExp", adminController.addWorkExp);
router.post("/updateWorkExp", adminController.updateWorkExp);
router.post("/removeWorkExp", adminController.removeWorkExp);
router.post("/removeMsg", adminController.removeMsg);
router.post("/markMsgRead", adminController.markMsgRead);
router.post(
  "/uploadFile",
  upload.single("uploaded_file"),
  adminController.uploadFile
); //file has been added to folder here
router.post(
  "/uploadProfilePic",
  upload.single("uploaded_pic"),
  adminController.uploadProfilePic
); //file has been added to folder here

module.exports = router;
