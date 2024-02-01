const mongoose = require("mongoose");
const PathProgress = require("./pathProgress");
const Challenge = require("./challenge");
const ChallengeProgress = require("./challengeProgress");

const learningPathSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  challenges: [{ type: mongoose.Schema.Types.ObjectId, ref: "Challenge" }],
});

learningPathSchema.statics.loadPathsAndProgress = async function (userId) {
  try {
    let firstPath;
    const pathProgresses = await PathProgress.find({ user: userId });
    const learningPaths = await this.find().lean();

    if (!pathProgresses.length) {
      const firstLearningPath = learningPaths[0];
      const firstPathProgress = new PathProgress({
        user: userId,
        learningPath: firstLearningPath.title,
        unlockedChallenges: [firstLearningPath.challenges[0]],
        totalChallenges: firstLearningPath.challenges.length,
      });
      await firstPathProgress.save();
      const challenges = await Challenge.find({ _id: { $in: firstLearningPath.challenges } });
      firstLearningPath.challenges = challenges;
      firstPath = firstPathProgress;
    }

    for (const pathProgress of pathProgresses) {
      const learningPath = learningPaths.find((path) => path.title === pathProgress.learningPath);
      const challenges = await Challenge.find({ _id: { $in: learningPath.challenges } }).lean();
      for (const challenge of challenges) {
        const challengeProgress = await ChallengeProgress.findOne({
          user: userId,
          challenge: challenge._id,
        });
        if (challengeProgress) {
          challenge.challengeProgress = challengeProgress;
        }
      }
      learningPath.challenges = challenges;
    }

    return { learningPaths, pathProgress: firstPath ? [firstPath] : pathProgresses };
  } catch (error) {
    console.log(error);
  }
};

const LearningPath = mongoose.model("LearningPath", learningPathSchema);

module.exports = LearningPath;
