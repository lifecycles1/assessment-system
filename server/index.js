require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

// Middleware
app.use(express.json());
app.use(cors());

// Database
const connectToMongoDB = require("./dbconnection/mongodb");
connectToMongoDB();

// Routes
const authRoutes = require("./routes/auth");
const assessmentRoutes = require("./routes/assessments");
app.use("/api", authRoutes);
app.use("/api", assessmentRoutes);
// learning paths routes
const learningPathsRoutes = require("./routes/learningPaths");
app.use("/api", learningPathsRoutes);
// forum routes
const topicRoutes = require("./routes/forum/topics");
const replyRoutes = require("./routes/forum/replies");
const likeRoutes = require("./routes/forum/likes");
const profileRoutes = require("./routes/forum/profile");
app.use("/api", topicRoutes);
app.use("/api", replyRoutes);
app.use("/api", likeRoutes);
app.use("/api", profileRoutes);

app.listen(8080, () => {
  console.log(`connected on port 8080`);
});
