const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("this is the back side of your butt!!");
});

module.exports = router;
