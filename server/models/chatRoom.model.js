const mongoose = require("mongoose");

const chatRoomSchema = new mongoose.Schema(
  {
    roomName: {
      type: String,
      required: [true, "You must provide a room name."],
      unique: [true, "The provided room name already exists."],
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    messages: [
      {
        from: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        body: {
          type: String,
          required: [true, "must supply a chat message body."],
        },
        created: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);
const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);

module.exports = ChatRoom;
