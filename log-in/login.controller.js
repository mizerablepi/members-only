const asyncHandler = require("express-async-handler");
const passport = require("passport");
const User = require("../models/user");

exports.loginGet = (req, res) => {
  res.render("log-in/form");
};

exports.loginPost = [
  (req, res, next) => {
    console.log(req.body.username, req.body.password);
    next();
  },
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/sign-up",
  }),
];
