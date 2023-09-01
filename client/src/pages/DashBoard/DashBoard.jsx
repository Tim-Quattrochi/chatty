import { useEffect, useState } from "react";
import useGetRooms from "../../hooks/useGetRooms";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import useAuthContext from "../../hooks/useAuthContext";
import LoadingSpinner from "../../components/Loading/LoadingSpinner";

const DashBoard = () => {
  const axiosPrivate = useAxiosPrivate();
  const { authState } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [chatName, setChatName] = useState("");

  const navigate = useNavigate();
  const rooms = useGetRooms();

  const handleClick = (roomId, roomName) => {
    setChatName(roomName);
    navigate(`/chat/${roomId}`, { state: { roomName } });
  };

  if (loading) return <LoadingSpinner />;

  console.log(rooms);
  return (
    <div>
      <h1>Dashboard</h1>
      <span>List of chats.</span>
      <ul>
        {rooms &&
          rooms.map((item) => (
            <li
              key={item.roomId}
              onClick={() => handleClick(item.roomId, item.roomName)}
            >
              {item.roomName}
              {/*room 64f00e7a9a67ca3839b7c99d works*/}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default DashBoard;
