const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  parentTopicId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Topic",
  },
  parentMessageId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  parentMessageCreator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  parentMessage: {
    type: String,
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

replySchema.methods.toggleLike = async function (userId) {
  const likeIndex = this.likes.indexOf(userId);
  if (likeIndex !== -1) {
    // User has already liked, remove the like
    this.likes.splice(likeIndex, 1);
  } else {
    // User hasn't liked, add a new like
    this.likes.push(userId);
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
