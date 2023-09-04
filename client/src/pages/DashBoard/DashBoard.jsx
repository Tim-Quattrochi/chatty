import { useEffect, useState } from "react";

import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import useAuthContext from "../../hooks/useAuthContext";
import useChatContext from "../../hooks/useChatContext";
import LoadingSpinner from "../../components/Loading/LoadingSpinner";
import "./dashBoard.css";

const DashBoard = () => {
  //When I comment the axiosPrivate, the bearer token never gets applied and I get a 403. When I uncomment it, it works. Even though the value isn't being read.

  const axiosPrivate = useAxiosPrivate();
  const { authState } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [chatName, setChatName] = useState("");

  const {
    chatState: { chats },
    handleLoadChats,
    handleAddChat,
  } = useChatContext();
  const userId = authState.user._id;

  const handleClick = ({ roomName }) => {
    setChatName(roomName);
    handleAddChat(roomName, null, userId);
  };

  useEffect(() => {
    handleLoadChats();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="dash-board-container">
      <h1 className="dash-board-title">Dashboard</h1>
      <span>List of chats.</span>
      <ul>
        {chats &&
          chats.map((item) => (
            <li
              className="room-list-item"
              key={item._id}
              onClick={() => handleClick(item)}
            >
              {item.roomName}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default DashBoard;
