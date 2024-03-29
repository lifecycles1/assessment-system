const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  role: { type: String, enum: ["student", "teacher"], required: true },
  email: { type: String, required: true, unique: true },
  picture: { type: String },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
