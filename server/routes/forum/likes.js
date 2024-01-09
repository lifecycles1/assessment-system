const express = require("express");
const router = express.Router();
const { toggleLike } = require("../../controllers/forum/likes");

// like the topic message or one of the replies
router.post("/:id/like", toggleLike);

module.exports = router;
