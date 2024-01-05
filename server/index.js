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
const question = require("./routes/question");
const assessmentRoutes = require("./routes/assessments");
app.use(authRoutes);
app.use(question);
app.use(assessmentRoutes);
// forum routes
const topicRoutes = require("./routes/forum/topics");
const replyRoutes = require("./routes/forum/replies");
app.use(topicRoutes);
app.use(replyRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`connected on port ${PORT}`);
});
