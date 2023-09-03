const ChatRoom = require("../models/chatRoom.model");

const getChatRooms = async (req, res, next) => {
  try {
    const id = req.id;

    const rooms = await ChatRoom.find({ members: id }).populate({
      path: "members",
      select: ["_id", "name"],
    });

    res.status(200).json(rooms);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getAllChatRooms = async (req, res, next) => {
  try {
    const rooms = await ChatRoom.find({}).populate({
      path: "members",
      select: ["_id", "name"],
    });

    res.status(200).json(rooms);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { getChatRooms, getAllChatRooms };
