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
app.use(authRoutes);
app.use(assessmentRoutes);
// learning paths routes
const learningPathsRoutes = require("./routes/learningPaths");
app.use(learningPathsRoutes);
// forum routes
const topicRoutes = require("./routes/forum/topics");
const replyRoutes = require("./routes/forum/replies");
const likeRoutes = require("./routes/forum/likes");
const profileRoutes = require("./routes/forum/profile");
app.use(topicRoutes);
app.use(replyRoutes);
app.use(likeRoutes);
app.use(profileRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`connected on port ${PORT}`);
});
