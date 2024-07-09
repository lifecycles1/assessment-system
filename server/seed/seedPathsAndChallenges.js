const mongoose = require("mongoose");
const Challenge = require("../models/challenge");
const LearningPath = require("../models/learningPath");
const { challengeData } = require("./challenges");
const { learningPathsData } = require("./learningPaths");

async function seedChallenges() {
  try {
    await Challenge.deleteMany();
    const challenges = await Challenge.insertMany(challengeData);

    return challenges;
  } catch (error) {
    console.error("Error seeding challenges:", error);
    throw error;
  }
}

async function seedLearningPaths(challenges) {
  try {
    await LearningPath.deleteMany();

    const learningPaths = learningPathsData.map((pathData) => {
      const pathChallenges = challenges.filter((challenge) => challenge.learningPath === pathData.title).map((challenge) => challenge._id);
      return { ...pathData, challenges: pathChallenges };
    });

    await LearningPath.insertMany(learningPaths, { ordered: true });
  } catch (error) {
    console.error("Error seeding learning paths:", error);
  }
}

async function seedDatabase() {
  mongoose.connect("mongodb://127.0.0.1:27017/code-assessment");
  try {
    const challenges = await seedChallenges();
    await seedLearningPaths(challenges);
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.disconnect();
    console.log(mongoose.connection.readyState); // disconnecting = 3
  }
}

seedDatabase();
