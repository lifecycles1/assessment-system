const User = require("../models/user");

const getLearningPaths = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    // FIRST TIME ONLY CONDITION - USER ACQUIRES ALL LEARNING PATHS AND A PATH PROGRESS FOR FIRST PATH
    if (!user.learningPaths.length) {
      const init = await user.initializeLearningPaths();
      // populate challenges for first path
      await init.populate("learningPaths.0.challenges", "title");
      return res.status(200).json(init);
    }

    // check progress [populate all id's in the pathProgress array with the pathProgress document]
    await user.populate("pathProgress");
    // get all document's titles (learningPath property)
    const pathProgressedTitles = user.pathProgress.map((progress) => progress.learningPath);
    // iterate over learningPaths
    for (const path of user.learningPaths) {
      // if the path title is in the pathProgressedTitles array
      if (pathProgressedTitles.includes(path.title)) {
        // populate the challenges array with the challenge titles
        // TO-DO: check if we should populate path.populate("challenges", "title") individually instead
        // TO-DO: when we have more than one pathProgress document
        await user.populate({ path: "learningPaths.challenges", select: "title", match: { learningPath: path.title } });
      }
    }

    console.log(
      "populated user:",
      user.learningPaths.map((path) => path.challenges)
    );
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error retrieving learning paths" });
  }
};

module.exports = { getLearningPaths };
