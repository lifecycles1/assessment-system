const ForumProfile = require("../../models/forum/profile");
const Topic = require("../../models/forum/topic");
const Reply = require("../../models/forum/reply");

const getProfile = async (req, res) => {
  try {
    const forumProfile = await ForumProfile.findOne({ user: req.user });
    const topics = await Topic.find({ creator: req.user });
    const replies = await Reply.find({ creator: req.user });

    // populate the 2 most recent replies' parentTopicId fields with the topic's title and category
    // for display on the user profile page (Summary tab)
    await Promise.all(replies.slice(-2).map(async (reply) => await reply.populate({ path: "parentTopicId", select: "title category" })));

    return res.status(200).json({ ...forumProfile.toObject(), topics, replies });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error retrieving user profile" });
  }
};

const incrementReadTime = async (req, res) => {
  try {
    const forumProfile = await ForumProfile.findOne({ user: req.user });
    forumProfile.incrementReadTime(req.body.time);
    return res.status(200).json();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error updating read time" });
  }
};

module.exports = { getProfile, incrementReadTime };
