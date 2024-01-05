const express = require("express");
const router = express.Router();
const { createTopic, getTopic, getTopics } = require("../../controllers/forum/topics");

// Create a new topic
router.post("/createTopic", createTopic);
// Get all topics
router.get("/topics/:category", getTopics);
// Get a single topic
router.get("/topics/:category/:id", getTopic);

module.exports = router;
