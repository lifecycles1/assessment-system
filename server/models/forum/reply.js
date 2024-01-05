const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  parentMessageId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  parentMessageCreator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  parentMessage: {
    type: String,
    required: true,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    validate: {
      validator: (arr) => arr.length === new Set(arr).size,
      message: "Duplicate user IDs are not allowed",
    },
  },
});

const Reply = mongoose.model("Reply", replySchema);

module.exports = { Reply, replySchema };
