const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  first_name: { type: String, required: true, minlength: 1, maxlength: 20 },
  last_name: { type: String, required: true, minlength: 1, maxlength: 20 },
  username: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 20,
    unique: true,
  },
  password: { type: String, required: true },
  membership_status: {
    type: String,
    required: true,
    enum: ["Member", "Non-Member"],
    default: "Non-Member",
  },
});

module.exports = mongoose.model("User", userSchema);
