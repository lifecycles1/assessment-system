const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema({
  title: { type: String },
  learningPath: { type: String },
  suggestedTime: { type: String },
  difficulty: { type: String, enum: ["easy", "medium", "hard"] },
  question: { type: String },
  example: { type: String },
  inputsOutputs: [
    {
      inputs: [{ type: mongoose.Schema.Types.Mixed }],
      output: { type: mongoose.Schema.Types.Mixed, default: null },
    },
  ],
});

const Challenge = mongoose.model("Challenge", challengeSchema);

module.exports = Challenge;
