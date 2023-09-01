const express = require("express");

const VerifyJWT = require("../middleware/VerifyJWT");
const {
  getChatRooms,
  getAllChatRooms,
} = require("../controllers/chatRooms.controller");

const chatRoomRouter = express.Router();

chatRoomRouter.get("/", VerifyJWT, getChatRooms);
chatRoomRouter.get("/all", VerifyJWT, getAllChatRooms);

module.exports = chatRoomRouter;
