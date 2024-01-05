const express = require("express");
const router = express.Router();
const { addReply } = require("../../controllers/forum/replies");

// Reply to a topic
// or reply to a reply of a topic (in both cases, the reply is being added to the topic's replies array)
router.post("/:id/reply", addReply);

module.exports = router;
