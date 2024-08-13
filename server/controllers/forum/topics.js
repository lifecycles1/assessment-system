const Topic = require("../../models/forum/topic");
const ForumProfile = require("../../models/forum/profile");
const Reply = require("../../models/forum/reply");

const createTopic = async (req, res) => {
  try {
    const { title, category, message } = req.body;

    const newTopic = new Topic({
      creator: req.user,
      title,
      message,
      category,
    });
    await newTopic.save();

    const forumProfile = await ForumProfile.findOne({ user: req.user });
    forumProfile.incrementPostCount();

    return res.status(201).json(newTopic);
  } catch (error) {
    console.error("Error creating topic:", error);
    return res.status(500).json({ message: "Error creating topic" });
  }
};

const getTopics = async (req, res) => {
  try {
    // no filter when category is "home", otherwise filter by category.
    const categoryFilter = req.params.category !== "home" ? { category: req.params.category } : {};
    const topics = await Topic.aggregate([
      { $match: categoryFilter },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "replies",
          localField: "_id",
          foreignField: "parentTopicId",
          as: "replies",
          pipeline: [
            {
              $project: {
                _id: 1,
              },
            },
          ],
        },
      },
    ]);

    const forumProfile = await ForumProfile.findOne({ user: req.user });
    forumProfile?.updateDaysVisited();

    return res.status(200).json(topics);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error retrieving topics" });
  }
};

const getTopic = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.topicId).populate({ path: "creator", select: "email picture" });
    const replies = await Reply.find({ parentTopicId: req.params.topicId }).populate({ path: "creator", select: "email picture" });

    topic.incrementViews();
    const forumProfile = await ForumProfile.findOne({ user: req.user });
    forumProfile.incrementTopicsViewed(req.params.topicId);

    return res.status(200).json({
      ...topic.toObject(),
      replies,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error retrieving topic" });
  }
};

module.exports = { createTopic, getTopic, getTopics };
