import { useEffect, useState } from "react";

import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import useAuthContext from "../../hooks/useAuthContext";
import useChatContext from "../../hooks/useChatContext";
import LoadingSpinner from "../../components/Loading/LoadingSpinner";

const DashBoard = () => {
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
    <div>
      <h1>Dashboard</h1>
      <span>List of chats.</span>
      <ul>
        {chats &&
          chats.map((item) => (
            <li key={item.roomId} onClick={() => handleClick(item)}>
              {item.roomName}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default DashBoard;
