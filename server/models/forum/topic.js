const mongoose = require("mongoose");
const { replySchema } = require("./reply");
const User = require("../user");

const topicSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  views: {
    type: Number,
    default: 0,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  replies: [replySchema],
});

// Middleware to decrement user's postCount when a post is deleted
topicSchema.post("remove", async function (doc, next) {
  try {
    await User.updateOne({ _id: doc.creator }, { $inc: { postCount: -1 } });
    next();
  } catch (error) {
    next(error);
  }
});

topicSchema.methods.incrementUserPostCount = async function () {
  try {
    await User.updateOne({ _id: this.creator }, { $inc: { postCount: 1 } });
  } catch (error) {
    throw error;
  }
};

topicSchema.methods.incrementUserReplyCount = async function () {
  try {
    await User.updateOne({ _id: this.creator }, { $inc: { replyCount: 1 } });
  } catch (error) {
    throw error;
  }
};

topicSchema.methods.incrementViews = async function () {
  try {
    await this.updateOne({ $inc: { views: 1 } });
  } catch (error) {
    throw error;
  }
};

topicSchema.methods.toggleLike = async function (userId) {
  const likeIndex = this.likes.indexOf(userId);
  if (likeIndex !== -1) {
    // User has already liked, remove the like
    this.likes.splice(likeIndex, 1);
  } else {
    // User hasn't liked, add a new like
    this.likes.push(userId);
  }
  await this.save();
};

const Topic = mongoose.model("Topic", topicSchema);

module.exports = Topic;
