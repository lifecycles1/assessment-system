const express = require("express");
const router = express.Router();
const { getProfile, incrementReadTime } = require("../../controllers/forum/profile");

// get user profile
router.get("/profile", getProfile);

// increment read time
router.put("/profile/read-time", incrementReadTime);

module.exports = router;
