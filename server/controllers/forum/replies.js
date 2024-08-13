const Topic = require("../../models/forum/topic");
const Reply = require("../../models/forum/reply");
const ForumProfile = require("../../models/forum/profile");

const addReply = async (req, res) => {
  try {
    const { message, parentMessageId, parentMessageCreator, parentMessage } = req.body;

    const topic = await Topic.findById(req.params.id);
    if (!topic) return res.status(404).json({ message: "Topic not found" });
    const newReply = new Reply({
      creator: req.user,
      message,
      parentTopicId: topic._id,
      parentMessageId,
      parentMessageCreator,
      parentMessage,
    });
    await newReply.save();

    const forumProfile = await ForumProfile.findOne({ user: req.user });
    forumProfile.incrementReplyCount();

    await newReply.populate({ path: "creator", select: "email picture" });
    return res.status(200).json(newReply);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error adding reply" });
  }
};

module.exports = { addReply };
