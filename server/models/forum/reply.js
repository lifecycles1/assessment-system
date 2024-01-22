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
    this.likes.splice(likeIndex, 1);
  } else {
    this.likes.push(userId);
  }
  await this.save();

  await User.bulkWrite([
    {
      updateOne: {
        filter: { _id: userId },
        update: { $inc: { likesGiven: likeIndex !== -1 ? -1 : 1 } },
      },
    },
    {
      updateOne: {
        filter: { _id: this.creator },
        update: { $inc: { likesReceived: likeIndex !== -1 ? -1 : 1 } },
      },
    },
  ]);

  const Topic = require("./topic");
  const topic = await Topic.findById(this.parentTopicId);
  const replyIndex = topic.replies.findIndex((reply) => reply._id.equals(this._id));
  /**
   * Index of the user's like in topic.reply.likes[]
   * @type {number}
   */
  const userLikeIndex = topic.replies[replyIndex].likes.indexOf(userId);
  if (userLikeIndex !== -1) {
    topic.replies[replyIndex].likes.splice(userLikeIndex, 1);
  } else {
    topic.replies[replyIndex].likes.push(userId);
  }
  await topic.save();
};

const Reply = mongoose.model("Reply", replySchema);

module.exports = { Reply, replySchema };
