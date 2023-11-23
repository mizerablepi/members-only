const asyncHandler = require("express-async-handler");
const Message = require("../models/message");
const User = require("../models/user");
const { body, validationResult } = require("express-validator");

exports.index = asyncHandler(async (req, res) => {
  const messages = await Message.find()
    .sort({ time: -1 })
    .populate("sender")
    .exec();
  console.log(
    "🚀 ~ file: board.controller.js:11 ~ exports.index=asyncHandler ~ messages:",
    messages[0].sender.username
  );

  if (req.user === undefined) {
    res.redirect("/log-in");
  } else {
    res.render("board/index", {
      user: req.user,
      messages,
    });
  }
});

exports.messagePost = [
  body("text", "invalid message")
    .trim()
    .isLength({ min: 1, max: 264 })
    .escape(),
  asyncHandler(async (req, res) => {
    const messages = await Message.find().sort({ time: -1 }).exec();

    const errors = validationResult(req);
    const newMessage = new Message({
      text: req.body.text,
      sender: req.user._id,
    });
    if (!errors.isEmpty()) {
      res.render("board/index", {
        user: req.user,
        messages,
      });
    } else {
      newMessage.save();
      res.redirect("/");
    }
  }),
];
