const mongoose = require("mongoose");

const pathProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  learningPath: { type: String, required: true },
  unlockedChallenges: [{ type: mongoose.Schema.Types.ObjectId, ref: "Challenge" }],
  totalChallenges: { type: Number, required: true },
});

const PathProgress = mongoose.model("PathProgress", pathProgressSchema);

module.exports = PathProgress;
