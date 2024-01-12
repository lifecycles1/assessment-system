const User = require("../../models/user");
const Topic = require("../../models/forum/topic");
const { Reply } = require("../../models/forum/reply");

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    const topics = await Topic.find({ creator: user._id });
    const replies = await Reply.find({ creator: user._id });
    const userProfile = {
      _id: user._id,
      createdAt: user.createdAt,
      role: user.role,
      email: user.email,
      picture: user.picture,
      daysVisited: user.daysVisited,
      readTime: user.readTime,
      topicsViewed: user.topicsViewed,
      postCount: user.postCount,
      replyCount: user.replyCount,
      likesGiven: user.likesGiven,
      likesReceived: user.likesReceived,
      topics,
      replies,
    };
    return res.status(200).json(userProfile);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error retrieving user profile" });
  }
};

const incrementDaysVisited = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) user.incrementDaysVisited();
    return res.status(200).json();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error updating days visited" });
  }
};

const incrementReadTime = async (req, res) => {
  try {
    const { time } = req.body;
    const user = await User.findById(req.params.id);
    if (user) {
      user.incrementReadTime(time);
    }
    return res.status(200).json();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error updating read time" });
  }
};

module.exports = { getProfile, incrementDaysVisited, incrementReadTime };
