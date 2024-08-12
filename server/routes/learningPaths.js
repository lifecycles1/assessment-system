const express = require("express");
const router = express.Router();
const { getLearningPaths, submitPathChallenge } = require("../controllers/learningPaths");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router.get("/lp", getLearningPaths);

router.post("/submit-pathChallenge", submitPathChallenge);

module.exports = router;
