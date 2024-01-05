const mongoose = require("mongoose");
const { replySchema } = require("./reply");

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
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    validate: {
      validator: (arr) => arr.length === new Set(arr).size,
      message: "Duplicate user IDs are not allowed",
    },
  },
  replies: [replySchema],
});

// Middleware to decrement user's postCount when a post is deleted
topicSchema.post("remove", async function (doc, next) {
  try {
    const User = mongoose.model("User");
    await User.updateOne({ _id: doc.creator }, { $inc: { postCount: -1 } });
    next();
  } catch (error) {
    next(error);
  }
});

topicSchema.methods.incrementUserPostCount = async function () {
  try {
    const User = mongoose.model("User");
    await User.updateOne({ _id: this.creator }, { $inc: { postCount: 1 } });
  } catch (error) {
    throw error;
  }
};

topicSchema.methods.incrementUserReplyCount = async function () {
  try {
    const User = mongoose.model("User");
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

topicSchema.methods.toggleLike = function (userId) {
  const index = this.likes.indexOf(userId);
  if (index !== -1) {
    this.likes.splice(index, 1);
  } else {
    this.likes.push(userId);
  }
};

topicSchema.methods.toggleReplyLike = function (replyId, userId) {
  const reply = this.replies.find((r) => r._id.equals(replyId));
  if (reply) {
    const index = reply.likes.indexOf(userId);
    if (index !== -1) {
      reply.likes.splice(index, 1);
    } else {
      reply.likes.push(userId);
    }
  }
};

const Topic = mongoose.model("Topic", topicSchema);

module.exports = Topic;
