const express = require("express");
const router = express.Router();
const { getLearningPaths } = require("../controllers/learningPaths");

router.get("/:userId/lp", getLearningPaths);

module.exports = router;
