const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  role: { type: String, enum: ["student", "teacher"], required: true },
  email: { type: String, required: true, unique: true },
  picture: { type: String },
  password: { type: String, required: true },
  daysVisited: [Date],
  readTime: { type: Number, default: 0 },
  topicsViewed: [{ type: mongoose.Schema.Types.ObjectId, ref: "Topic" }],
  postCount: { type: Number, default: 0 },
  replyCount: { type: Number, default: 0 },
  likesGiven: { type: Number, default: 0 },
  likesReceived: { type: Number, default: 0 },
});

userSchema.methods.incrementDaysVisited = async function () {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    await this.updateOne({ $addToSet: { daysVisited: today } });
  } catch (error) {
    throw error;
  }
};

userSchema.methods.incrementReadTime = async function (time) {
  try {
    await this.updateOne({ $inc: { readTime: time } });
  } catch (error) {
    throw error;
  }
};

userSchema.methods.incrementTopicsViewed = async function (topicId) {
  try {
    await this.updateOne({ $addToSet: { topicsViewed: topicId } });
  } catch (error) {
    throw error;
  }
};

userSchema.methods.incrementPostCount = async function () {
  try {
    await this.updateOne({ $inc: { postCount: 1 } });
  } catch (error) {
    throw error;
  }
};

userSchema.methods.incrementReplyCount = async function () {
  try {
    await this.updateOne({ $inc: { replyCount: 1 } });
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;
