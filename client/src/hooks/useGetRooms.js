import { useEffect, useState } from "react";
import useAxiosPrivate from "./useAxiosPrivate";

//create a react hook to get all chat rooms
const useGetRooms = () => {
  const [rooms, setRooms] = useState([]);
  const axios = useAxiosPrivate();
  const getRooms = async () => {
    try {
      const { data } = await axios.get("/chat/all");
      data.map((room) => {
        const roomName = room.roomName;
        const roomId = room._id;
        //only add the room if it doesn't already exist
        if (!rooms.some((room) => room.roomId === roomId)) {
          setRooms((prev) => [...prev, { roomName, roomId }]);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getRooms();
  }, []);
  return rooms;
};

export default useGetRooms;
