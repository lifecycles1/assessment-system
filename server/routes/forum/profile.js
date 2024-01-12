const express = require("express");
const router = express.Router();
const { getProfile, incrementDaysVisited, incrementReadTime } = require("../../controllers/forum/profile");

// get user profile
router.get("/profile/:id", getProfile);
// increment days visited
router.put("/profile/:id/days-visited", incrementDaysVisited);
// increment read time
router.put("/profile/:id/read-time", incrementReadTime);

module.exports = router;
