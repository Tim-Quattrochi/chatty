const express = require("express");
const VerifyJWT = require("../middleware/VerifyJWT");
const { getAllUsers } = require("../controllers/friends.controller");

const friendsRouter = express.Router();

friendsRouter.get("/all", VerifyJWT, getAllUsers);

module.exports = friendsRouter;
