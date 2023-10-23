const mongoose = require("mongoose");

// Common fields for both submission types, including optional fields for the evaluation results
const commonFields = {
  email: { type: String, required: true },
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now },
  evaluation: {
    grade: { type: Number },
    feedback: { type: String },
  },
  question: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
};

// Schema for code editor assessments
const editorAssessmentSchema = new mongoose.Schema({
  ...commonFields,
  code: { type: String, required: true },
  language: { type: String, required: true },
});

// Schema for file assessments
const fileAssessmentSchema = new mongoose.Schema({
  ...commonFields,
  fileName: { type: String, required: true },
  fileType: { type: String, required: true },
  language: { type: String, required: true },
  fileUrl: { type: String, required: true },
});

// Models
const EditorAssessment = mongoose.model("EditorAssessment", editorAssessmentSchema);
const FileAssessment = mongoose.model("FileAssessment", fileAssessmentSchema);

module.exports = { EditorAssessment, FileAssessment };
