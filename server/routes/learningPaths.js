const express = require("express");
const router = express.Router();
const { getLearningPaths, submitPathChallenge } = require("../controllers/learningPaths");
const verifyJWT = require("../middleware/verifyJWT");

router.get("/lp", verifyJWT, getLearningPaths);

router.post("/submit-pathChallenge", verifyJWT, submitPathChallenge);

module.exports = router;
