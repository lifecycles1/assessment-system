const mongoose = require("mongoose");
const { Challenge } = require("../models/challenge");
const { LearningPath } = require("../models/learningPath");
const { challengeData } = require("./challenges");
const { learningPathsData } = require("./learningPaths");

mongoose.connect("mongodb://127.0.0.1:27017/code-assessment");

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

    await LearningPath.insertMany(learningPaths);
  } catch (error) {
    console.error("Error seeding learning paths:", error);
  } finally {
    mongoose.connection.close();
  }
}

async function seedDatabase() {
  try {
    const challenges = await seedChallenges();
    await seedLearningPaths(challenges);
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seedDatabase();
