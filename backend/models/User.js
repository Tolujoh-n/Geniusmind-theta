// models/User.js

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  walletID: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    default: "Anonymous",
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
