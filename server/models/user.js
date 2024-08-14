const mongoose = require("mongoose");
const Topic = require("./forum/topic");
const Reply = require("./forum/reply");
const PathProgress = require("./pathProgress");
const ChallengeProgress = require("./challengeProgress");
const ForumProfile = require("./forum/profile");
const { EditorAssessment, FileAssessment } = require("./assessment");

const userSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  role: { type: String, enum: ["student", "teacher"], required: true },
  email: { type: String, required: true, unique: true },
  picture: { type: String },
  password: { type: String, required: true },
});

// Post-remove middleware to delete all posts and replies of the user
userSchema.post("remove", async function (doc, next) {
  try {
    // Delete all posts by the user
    await Topic.deleteMany({ creator: doc._id });

    // Delete all replies by the user
    await Reply.deleteMany({ creator: doc._id });

    // Delete all pathProgresses by the user
    await PathProgress.deleteMany({ user: doc._id });

    // Delete all challengeProgresses by the user
    await ChallengeProgress.deleteMany({ user: doc._id });

    // Delete the user's forum profile
    await ForumProfile.deleteOne({ user: doc._id });

    // Delete all EditorAssessments by the user
    await EditorAssessment.deleteMany({ email: doc.email });

    // Delete all FileAssessments by the user
    await FileAssessment.deleteMany({ email: doc.email });

    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
