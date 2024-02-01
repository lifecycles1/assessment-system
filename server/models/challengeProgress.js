const mongoose = require("mongoose");

// Challenge will be incorporated into LearningPaths and Assessments sections
const challengeProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  challenge: { type: mongoose.Schema.Types.ObjectId, ref: "Challenge" },
  createdAt: { type: Date, default: Date.now },
  code: [
    {
      language: { type: String, required: true },
      code: { type: String, required: true },
    },
  ],
  // Assessments
  evaluation: {
    grade: { type: Number },
    feedback: { type: String },
  },
  // undecided feature
  // fileUrl: { type: String, required: true },
});

const ChallengeProgress = mongoose.model("ChallengeProgress", challengeProgressSchema);

module.exports = ChallengeProgress;
