const router = require("express").Router();

const userController = require("../controllers/userController");
router.get("/defaultGetUser", userController.defaultGetUser);
router.post("/adminLogin", userController.adminLogin);
router.post("/sendWhatsappMsg", userController.sendWhatsappMsg);

module.exports = router;
