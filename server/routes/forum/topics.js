const express = require("express");
const router = express.Router();
const { createTopic, getTopic, getTopics } = require("../../controllers/forum/topics");
const verifyJWT = require("../../middleware/verifyJWT");

// Create a new topic
router.post("/createTopic", verifyJWT, createTopic);
// Get all topics
router.get("/topics/:category", verifyJWT, getTopics);
// Get a single topic
router.get("/topics/:category/:topicId", verifyJWT, getTopic);

module.exports = router;
