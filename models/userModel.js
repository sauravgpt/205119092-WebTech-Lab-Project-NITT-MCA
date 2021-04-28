const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: String,
});

module.exports = mongoose.model("User", userSchema);
