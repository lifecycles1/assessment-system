const mongoose = require("mongoose");

const connectToMongoDB = async () => {
  try {
    // deployed version - use process.env.CLOUD_MONGODB_URI
    await mongoose.connect(process.env.LOCAL_MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("error connecting to MongoDB", error);
  }
};

const disconnectFromMongoDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.log("error disconnecting from MongoDB", error);
  }
};

module.exports = { connectToMongoDB, disconnectFromMongoDB };
