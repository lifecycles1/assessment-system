const LearningPath = require("../models/learningPath");

const getLearningPaths = async (req, res) => {
  try {
    const pathsAndProgress = await LearningPath.loadPathsAndProgress(req.params.userId);
    return res.status(200).json(pathsAndProgress);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error retrieving learning paths" });
  }
};

module.exports = { getLearningPaths };
