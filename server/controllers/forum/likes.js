const Topic = require("../../models/forum/topic");
const { Reply } = require("../../models/forum/reply");

const toggleLike = async (req, res) => {
  try {
    const { type, userId } = req.body;
    const Model = type === "topic" ? Topic : Reply;
    const doc = await Model.findById(req.params.id);
    doc.toggleLike(userId);
    return res.status(200).json(doc);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error toggling like" });
  }
};

module.exports = { toggleLike };
