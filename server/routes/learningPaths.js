const express = require("express");
const router = express.Router();
const { getLearningPaths, submitPathChallenge } = require("../controllers/learningPaths");

router.get("/lp", getLearningPaths);

router.post("/submit-pathChallenge", submitPathChallenge);

module.exports = router;
