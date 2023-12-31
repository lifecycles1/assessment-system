const Topic = require("../../models/forum/topic");
const { Reply } = require("../../models/forum/reply");

const addReply = async (req, res) => {
  try {
    const { userId, message, parentMessageId, parentMessageCreator, parentMessage } = req.body;

    const topic = await Topic.findById(req.params.id);
    if (!topic) return res.status(404).json({ message: "Topic not found" });
    const newReply = new Reply({
      creator: userId,
      message,
      parentMessageId,
      parentMessageCreator,
      parentMessage,
    });
    topic.replies.push(newReply);
    await topic.incrementUserReplyCount(userId);
    await Promise.all([topic.save(), newReply.save()]);
    await newReply.populate({ path: "creator", select: "email picture" });
    return res.status(200).json(newReply);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error adding reply" });
  }
};

module.exports = { addReply };
