const mongoose = require("mongoose");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
  },

  password: {
    type: String,
    unique: true,
    required: true,

  },

  token: String,

});

module.exports = mongoose.model("User", UserSchema);
