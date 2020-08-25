const router = require("express").Router();
const verify = require("./verifyToken");
const User = require("../model/User");

router.get("/", verify, (req, res) => {
  // lot out the registred user
  res.send(req.user);
  //   const user = User.findOne({ _id: req.user.id });
  //   if (user) {
  //     console.log("Found");
  //   }
});

module.exports = router;
