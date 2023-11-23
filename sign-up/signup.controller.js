const User = require("../models/user");
const asynHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

exports.signupGet = (req, res) => {
  res.render("sign-up/form");
};

exports.signupPost = asynHandler(async (req, res) => {
  const userExists = await User.findOne({ username: req.body.username }).exec();

  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const user = new User({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    username: req.body.username,
    password: hashedPassword,
  });

  if (userExists) {
    res.render("sign-up/form", {
      user,
      error: "User Exists",
    });
  } else {
    user.save();
    res.redirect("/");
  }
});
