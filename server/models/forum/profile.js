const mongoose = require("mongoose");

const forumProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  daysVisited: [Date],
  readTime: { type: Number, default: 0 },
  topicsViewed: [{ type: mongoose.Schema.Types.ObjectId, ref: "Topic" }],
  postCount: { type: Number, default: 0 },
  replyCount: { type: Number, default: 0 },
  likesGiven: { type: Number, default: 0 },
  likesReceived: { type: Number, default: 0 },
});

forumProfileSchema.methods.updateDaysVisited = async function () {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (this.daysVisited[this.daysVisited.length - 1]?.getTime() !== today.getTime()) {
      await this.updateOne({ $push: { daysVisited: today } });
    }
  } catch (error) {
    console.log(error);
  }
};

forumProfileSchema.methods.incrementReadTime = async function (time) {
  try {
    await this.updateOne({ $inc: { readTime: time } });
  } catch (error) {
    console.log(error);
  }
};

forumProfileSchema.methods.incrementTopicsViewed = async function (topicId) {
  try {
    await this.updateOne({ $addToSet: { topicsViewed: topicId } });
  } catch (error) {
    console.log(error);
  }
};

forumProfileSchema.methods.incrementPostCount = async function () {
  try {
    await this.updateOne({ $inc: { postCount: 1 } });
  } catch (error) {
    console.log(error);
  }
};

forumProfileSchema.methods.incrementReplyCount = async function () {
  try {
    await this.updateOne({ $inc: { replyCount: 1 } });
  } catch (error) {
    console.log(error);
  }
};

const ForumProfile = mongoose.model("ForumProfile", forumProfileSchema);

module.exports = ForumProfile;
