const express = require("express");
const router = express.Router();
const { getProfile, incrementReadTime } = require("../../controllers/forum/profile");
const verifyJWT = require("../../middleware/verifyJWT");

// get user profile
router.get("/profile", verifyJWT, getProfile);

// increment read time
router.put("/profile/read-time", verifyJWT, incrementReadTime);

module.exports = router;
