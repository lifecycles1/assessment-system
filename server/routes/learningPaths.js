const express = require("express");
const router = express.Router();
const { getLearningPaths, submitPathChallenge } = require("../controllers/learningPaths");

router.get("/:userId/lp", getLearningPaths);

router.post("/submit-pathChallenge", submitPathChallenge);

module.exports = router;
