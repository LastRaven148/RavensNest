const mongoose =
  require("mongoose");

module.exports =
  mongoose.model(
    "Message",
    new mongoose.Schema({
      chatId: String,
      from: String,
      to: String,
      text: String,

      createdAt: {
        type: Date,
        default: Date.now
      }
    })
  );