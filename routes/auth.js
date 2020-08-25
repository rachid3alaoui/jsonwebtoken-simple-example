const router = require("express").Router();
const User = require("../model/User");
const bcrypt = require("bcrypt");
const { registerValidation, loginValidation } = require("../validation");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  // Validate the data before we make a user
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if the user email is already in the database
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email already exists");

  // Hasch the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // Create new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  try {
    const savedUser = await user.save();
    res.status(201).json({ user: savedUser._id });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // checking if the email exists in the database
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email is not found");
  // check if the password is correct
  const validePassword = await bcrypt.compare(req.body.password, user.password);
  if (!validePassword) return res.status(400).send("Wrong password");

  // Create and assign a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("authToken", token).json(token);
});

module.exports = router;
