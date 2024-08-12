const LearningPath = require("../models/learningPath");
const PathProgress = require("../models/pathProgress");
const ChallengeProgress = require("../models/challengeProgress");

const getLearningPaths = async (req, res) => {
  try {
    const pathsAndProgress = await LearningPath.loadPathsAndProgress(req.user);
    return res.status(200).json(pathsAndProgress);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error retrieving learning paths" });
  }
};

const submitPathChallenge = async (req, res) => {
  try {
    const { userId, pathProgressId, challengeId, language, code } = req.body;

    const challengeProgress = await ChallengeProgress.findOne({ challenge: challengeId, user: userId });

    // 1. save user solution code to UI
    // - if no challengeProg
    if (!challengeProgress) {
      const newChallengeProgress = new ChallengeProgress({
        user: userId,
        challenge: challengeId,
        code: [{ language, code }],
      });
      await newChallengeProgress.save();

      // 2. unlock next challenge or next path and its first challenge
      const pathProgress = await PathProgress.findById(pathProgressId);
      const currentPath = await LearningPath.findOne({ title: pathProgress.learningPath });
      const nextChallengeIndex = pathProgress.unlockedChallenges.length;
      // if no more challenges on this path, unlock the next path and its first challenge
      if (nextChallengeIndex === currentPath.challenges.length) {
        const nextPath = await LearningPath.findOne({ _id: { $gt: currentPath._id } });
        if (nextPath) {
          const nextPathProgress = new PathProgress({
            user: userId,
            learningPath: nextPath.title,
            unlockedChallenges: [nextPath.challenges[0]],
            totalChallenges: nextPath.challenges.length,
          });
          await nextPathProgress.save();
        } // NO ELSE CASE - GAME OVER FOR THE LEARNING PATHS SECTION: if there's no next path, the user has completed all paths and his submits are going down in the last else case just to update the code in the challengeProg object - they are not unlocking anything new
      }
      // otherwise unlock the next challenge in the current path
      else {
        pathProgress.unlockedChallenges.push(currentPath.challenges[nextChallengeIndex]);
        await pathProgress.save();
      }
    }
    // - or if there is a challengeProg that means the user keeps submitting the same challenge
    // we just need to update the code in the challengeProg object
    else {
      const languageIndex = challengeProgress.code.findIndex((submission) => submission.language === language);
      if (languageIndex === -1) {
        challengeProgress.code.push({ language, code });
      } else {
        challengeProgress.code[languageIndex].code = code;
      }
      await challengeProgress.save();
    }

    return res.status(200).json({ message: "success" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error submitting challenge" });
  }
};

module.exports = { getLearningPaths, submitPathChallenge };
