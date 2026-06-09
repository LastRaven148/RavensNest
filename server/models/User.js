const mongoose =
  require("mongoose");

module.exports =
  mongoose.model(
    "User",
    new mongoose.Schema({
      username: {
        type: String,
        unique: true
      },

      password: String,

      avatar: {
        type: String,
        default: ""
      },

      bio: {
        type: String,
        default: ""
      }
    })
  );