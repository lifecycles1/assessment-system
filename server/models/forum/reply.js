const mongoose = require("mongoose");
const ForumProfile = require("./profile");

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

// Middleware to decrement user's replyCount when a reply is deleted
replySchema.post("remove", async function (doc, next) {
  try {
    await ForumProfile.updateOne({ user: doc.creator }, { $inc: { replyCount: -1 } });
    next();
  } catch (error) {
    next(error);
  }
});

replySchema.methods.toggleLike = async function (userId) {
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
};

const Reply = mongoose.model("Reply", replySchema);

module.exports = Reply;
