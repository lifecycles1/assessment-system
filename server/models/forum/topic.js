const mongoose = require("mongoose");
const ForumProfile = require("./profile");

const topicSchema = new mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  category: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  views: { type: Number, default: 0 },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

// Middleware to decrement user's postCount when a post is deleted
topicSchema.post("remove", async function (doc, next) {
  try {
    await ForumProfile.updateOne({ user: doc.creator }, { $inc: { postCount: -1 } });
    next();
  } catch (error) {
    next(error);
  }
});

topicSchema.methods.incrementViews = async function () {
  try {
    await this.updateOne({ $inc: { views: 1 } });
  } catch (error) {
    console.log(error);
  }
};

topicSchema.methods.toggleLike = async function (userId) {
  try {
    const likeIndex = this.likes.indexOf(userId);
    if (likeIndex !== -1) {
      this.likes.splice(likeIndex, 1);
    } else {
      this.likes.push(userId);
    }
    await this.save();

    const likeCountUpdate = likeIndex !== -1 ? -1 : 1;

    await ForumProfile.bulkWrite([
      {
        updateOne: {
          filter: { user: userId },
          update: {
            $inc: {
              likesGiven: likeCountUpdate,
            },
          },
        },
      },
      {
        updateOne: {
          filter: { user: this.creator },
          update: {
            $inc: {
              likesReceived: likeCountUpdate,
            },
          },
        },
      },
    ]);
  } catch (error) {
    console.log(error);
  }
};

const Topic = mongoose.model("Topic", topicSchema);

module.exports = Topic;
