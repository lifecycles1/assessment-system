const Topic = require("../../models/forum/topic");

const createTopic = async (req, res) => {
  const { title, category, message, userId } = req.body;
  try {
    const newTopic = new Topic({
      creator: userId,
      title,
      message,
      category,
    });
    await newTopic.incrementUserPostCount(userId);
    await newTopic.save();
    return res.status(201).json(newTopic);
  } catch (error) {
    console.error("Error creating topic:", error);
    return res.status(500).json({ message: "Error creating topic" });
  }
};

const getTopics = async (req, res) => {
  try {
    const categoryFilter = req.params.category ? { category: req.params.category } : {};
    const topics = await Topic.find(categoryFilter);
    return res.status(200).json(topics);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error retrieving topics" });
  }
};

const getTopic = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id)
      // populate the Topic's creator field with the creator's email and picture,
      // then populate the replies' creator fields with the repliers' email and picture
      .populate({
        path: "creator",
        select: "email picture",
      })
      .populate({
        path: "replies.creator",
        select: "email picture",
      });

    topic.incrementViews();
    return res.status(200).json(topic);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error retrieving topic" });
  }
};

module.exports = { createTopic, getTopic, getTopics };
