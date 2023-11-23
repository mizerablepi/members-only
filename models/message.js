const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  text: { type: String, required: true, minlength: 1, maxlength: 264 },
  sender: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  time: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", messageSchema);
