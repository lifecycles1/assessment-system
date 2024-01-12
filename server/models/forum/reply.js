const mongoose = require("mongoose");
const User = require("../user");

const replySchema = new mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  parentTopicId: { type: mongoose.Schema.Types.ObjectId, ref: "Topic", required: true },
  parentMessageId: { type: mongoose.Schema.Types.ObjectId, required: true },
  parentMessageCreator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  parentMessage: { type: String, required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

replySchema.methods.toggleLike = async function (userId) {
  const likeIndex = this.likes.indexOf(userId);
  if (likeIndex !== -1) {
    // User has already liked, remove the like
    this.likes.splice(likeIndex, 1);
    // Decrement the user's likesGiven count
    await User.updateOne({ _id: userId }, { $inc: { likesGiven: -1 } });
    // Decrement the reply's creator's likesReceived count
    await User.updateOne({ _id: this.creator }, { $inc: { likesReceived: -1 } });
  } else {
    // User hasn't liked, add a new like
    this.likes.push(userId);
    // Increment the user's likesGiven count
    await User.updateOne({ _id: userId }, { $inc: { likesGiven: 1 } });
    // Increment the reply's creator's likesReceived count
    await User.updateOne({ _id: this.creator }, { $inc: { likesReceived: 1 } });
  }
  await this.save();

  const Topic = require("./topic");
  const topic = await Topic.findById(this.parentTopicId);
  const replyIndex = topic.replies.findIndex((reply) => reply._id.equals(this._id));
  const topicLikeIndex = topic.replies[replyIndex].likes.indexOf(userId);
  if (topicLikeIndex !== -1) {
    topic.replies[replyIndex].likes.splice(topicLikeIndex, 1);
  } else {
    topic.replies[replyIndex].likes.push(userId);
  }
  await topic.save();
};

const Reply = mongoose.model("Reply", replySchema);

module.exports = { Reply, replySchema };
