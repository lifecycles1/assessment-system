const mongoose = require("mongoose");

// Common fields for both submission types, including optional fields for the evaluation results
const commonFields = {
  email: { type: String, required: true },
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now },
  language: { type: String, required: true },
  question: {
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    learningPath: { type: String, required: true },
    suggestedTime: { type: String, required: true },
    difficulty: { type: String, required: true },
    question: { type: String, required: true },
    example: { type: String, required: true },
    inputsOutputs: [
      {
        inputs: { type: mongoose.Schema.Types.Mixed },
        output: { type: mongoose.Schema.Types.Mixed },
      },
    ],
  },
  evaluation: {
    grade: { type: Number },
    feedback: { type: String },
  },
};

// Schema for code editor assessments
const editorAssessmentSchema = new mongoose.Schema({
  ...commonFields,
  code: { type: String, required: true },
});

// Schema for file assessments
const fileAssessmentSchema = new mongoose.Schema({
  ...commonFields,
  fileUrl: { type: String, required: true },
});

// Models
const EditorAssessment = mongoose.model("EditorAssessment", editorAssessmentSchema);
const FileAssessment = mongoose.model("FileAssessment", fileAssessmentSchema);

module.exports = { EditorAssessment, FileAssessment };
