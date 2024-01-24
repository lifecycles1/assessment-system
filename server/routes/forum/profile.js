const express = require("express");
const router = express.Router();
const { getProfile, incrementReadTime } = require("../../controllers/forum/profile");

// get user profile
router.get("/profile/:id", getProfile);

// increment read time
router.put("/profile/:id/read-time", incrementReadTime);

module.exports = router;
