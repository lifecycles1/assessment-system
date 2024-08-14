const express = require("express");
const router = express.Router();
const { toggleLike } = require("../../controllers/forum/likes");
const verifyJWT = require("../../middleware/verifyJWT");

// like the topic message or one of the replies
router.post("/:id/like", verifyJWT, toggleLike);

module.exports = router;
