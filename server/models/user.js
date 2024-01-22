const mongoose = require("mongoose");
const { LearningPath, learningPathSchema } = require("./learningPath");
const { PathProgress, pathProgressSchema } = require("./pathProgress");
const Challenge = require("./challenge");

const userSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  role: { type: String, enum: ["student", "teacher"], required: true },
  email: { type: String, required: true, unique: true },
  picture: { type: String },
  password: { type: String, required: true },
  // forum specific fields
  daysVisited: [Date],
  readTime: { type: Number, default: 0 },
  topicsViewed: [{ type: mongoose.Schema.Types.ObjectId, ref: "Topic" }],
  postCount: { type: Number, default: 0 },
  replyCount: { type: Number, default: 0 },
  likesGiven: { type: Number, default: 0 },
  likesReceived: { type: Number, default: 0 },
  // coding challenges specific fields
  learningPaths: [learningPathSchema],
  pathProgress: [pathProgressSchema],
});

userSchema.methods.initializeLearningPaths = async function () {
  // RUNS ONCE PER USER- USER ACQUIRES ALL LEARNING PATHS AND A PATH PROGRESS FOR FIRST PATH
  try {
    // const challenges = await Challenge.find({ _id: { $in: firstLearningPath.challenges } });

    // fetch all learning paths
    const learningPaths = await LearningPath.find();
    const firstLearningPath = learningPaths[0];

    // create a path progress for the first path
    const firstPathProgress = new PathProgress({
      learningPath: firstLearningPath.title,
      totalChallenges: firstLearningPath.challenges.length,
    });
    await firstPathProgress.save();

    const updatedUser = await mongoose.model("User").findOneAndUpdate(
      { _id: this._id },
      // update the user document with all learningPaths and firstPathProgress
      { $set: { learningPaths: learningPaths, pathProgress: [firstPathProgress] } },
      { new: true }
    );

    return updatedUser;
  } catch (error) {
    console.log(error);
  }
};

userSchema.methods.incrementDaysVisited = async function () {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    await this.updateOne({ $addToSet: { daysVisited: today } });
  } catch (error) {
    console.log(error);
  }
};

userSchema.methods.incrementReadTime = async function (time) {
  try {
    await this.updateOne({ $inc: { readTime: time } });
  } catch (error) {
    console.log(error);
  }
};

userSchema.methods.incrementTopicsViewed = async function (topicId) {
  try {
    await this.updateOne({ $addToSet: { topicsViewed: topicId } });
  } catch (error) {
    console.log(error);
  }
};

userSchema.methods.incrementPostCount = async function () {
  try {
    await this.updateOne({ $inc: { postCount: 1 } });
  } catch (error) {
    console.log(error);
  }
};

userSchema.methods.incrementReplyCount = async function () {
  try {
    await this.updateOne({ $inc: { replyCount: 1 } });
  } catch (error) {
    console.log(error);
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;
