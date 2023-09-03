const dotenv = require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const cookieParser = require("cookie-parser");
const { PORT, NODE_ENV, API_URL } = require("./config/constants");
const connectDB = require("./config/db");
const userRouter = require("./routes/auth.routes");
const { logger } = require("./middleware/logger");
const { AppError } = require("./middleware/AppError");
const credentials = require("./middleware/credentials");
const corsOptions = require("./config/corsOptions");
const { Server } = require("socket.io");
const User = require("./models/user.model");
const ChatRoom = require("./models/chatRoom.model");
const Message = require("./models/message.model");
const chatRoomRouter = require("./routes/chatRoom.routes");
const friendsRouter = require("./routes/friends.routes");

const app = express();

//DB connection
connectDB();

//Middlewares
app.use(cors(corsOptions));
app.use(morgan("dev")); //logging
app.use(credentials);
app.use(logger);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

//routes
app.use(`${API_URL}/auth`, userRouter);
app.use(`${API_URL}/chat`, chatRoomRouter);
app.use(`${API_URL}/users`, friendsRouter);

//error handler middlemare.
app.use(AppError);

const server = app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Server is listening on port: ${PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.emit("connected");

  socket.on("handshake", async (userId) => {
    await User.findByIdAndUpdate(userId, { activeSocket: socket.id });
    const chatRooms = await ChatRoom.find({ members: userId });
  });

  socket.on("retrieveMessages", async (roomId) => {
    if (roomId) {
      const room = await ChatRoom.findById(roomId).populate({
        path: "messages",
        populate: "from",
      });

      socket.join(roomId);

      if (room && room.messages.length > 0) {
        socket.emit("messagesLoaded", room.messages);
      } else if (room && room.messages.length === 0) {
        console.log(room.messages);
        socket.emit("messagesLoaded", "no messages yet");
        return;
      }
    }
  });

  socket.on("retrieveChatRooms", async (userId) => {
    const chatRooms = await ChatRoom.find({}).select([
      "roomName",
      "_id",
    ]);

    //map the rooms to json and only send the room name and room id

    const mappedOutRooms = chatRooms.map((room) => {
      return {
        roomName: room.roomName,
        _id: room._id,
      };
    });
    socket.emit("chatRoomsLoaded", mappedOutRooms);
  });

  socket.on("connect", async (id) => {
    const rooms = await ChatRoom.find({ members: id });

    socket.emit("connected", rooms);
  });

  socket.on("joinRoom", async ({ roomName, otherUid, userId }) => {
    //check if the room exists
    console.log(userId);
    console.log(roomName);
    const update = {
      $addToSet: otherUid
        ? { members: [otherUid, userId] }
        : { members: [userId] },
    };

    const options = {
      upsert: true, //create the document if it doesn't exist
      new: true, //return the updated document
    };
    try {
      const room = await ChatRoom.findOneAndUpdate(
        {
          roomName,
        },
        update,
        options
      ).populate({ path: "members", select: ["_id", "name"] });

      if (room) {
        //join the room
        socket.join(room._id);

        //send the room to the client
        socket.emit("roomJoined", room);
      }
    } catch (error) {
      console.log(error);
      socket.emit("error", error);
    }
  });

  socket.on("createChatRoom", async (members) => {
    console.log("MEMBERS", members);
    const newRoom = await ChatRoom.create({ members });
    const users = await User.find({ _id: { $in: members } });

    newRoom.members = users;

    for (let user of users) {
      if (user.activeSocket && user.activeSocket !== socket.id) {
        socket.to(user.activeSocket).emit("chatCreated", newRoom);
      }
    }

    socket.emit("chatCreated", newRoom);
  });

  socket.on("disconnect", async () => {
    console.log("a user disconnected.");
    await User.findOneAndUpdate(
      { activeSocket: socket.id },
      { activeSocket: null }
    );
  });

  socket.on("typing", async ({ sender, roomId }) => {
    console.log(sender);
    const room = await ChatRoom.findById(roomId).populate("members");
    console.log(room);
    for (let user of room.members) {
      console.log(user.activeSocket);
      // if (user.name !== sender) {

      socket.to(user.activeSocket).emit("otherUserTyping", sender);
      // }
    }
  });

  socket.on("send_message", async ({ body, from, roomId }) => {
    console.log("message received from", from);

    const user = await User.findById(from);
    const messageData = {
      from: user.name,
      body,
      roomId,
    };
    const room = await ChatRoom.findByIdAndUpdate(
      roomId,
      { $addToSet: { messages: { body, from } } },
      { new: true }
    ).populate("members");

    for (let user of room.members) {
      socket
        .to(user.activeSocket)
        .emit("receive_message", messageData);
    }
  });
});

//server static files in production
if (NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));

  app.all("*", (req, res, next) => {
    res.sendFile(
      path.resolve(__dirname, "../client/dist/index.html")
    );
  });
}
