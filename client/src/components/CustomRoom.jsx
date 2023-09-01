import React, { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import useAuthContext from "../hooks/useAuthContext";

const CustomRoom = () => {
  const [room, setRoom] = useState("");

  const {
    authState: { user },
  } = useAuthContext();

  const socket = useSocket();
  //this component will be used to display the custom room
  useEffect(() => {
    //get the custom room from the database
    socket.emit("joinRoom", {
      userId: user?._id,
      room,
    });
    setRoom(room);
    console.log(room);

    //display the custom room
  }, [room, socket, user?._id]);

  return <div>{room}</div>;
};

export default CustomRoom;
