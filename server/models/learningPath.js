const mongoose = require("mongoose");

const learningPathSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  challenges: [{ type: mongoose.Schema.Types.ObjectId, ref: "Challenge" }],
});

const LearningPath = mongoose.model("LearningPath", learningPathSchema);

module.exports = { LearningPath, learningPathSchema };
