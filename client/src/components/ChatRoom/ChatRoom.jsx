import { useState, useEffect, useRef } from "react";
import useAuthContext from "../../hooks/useAuthContext";
import useChatContext from "../../hooks/useChatContext";
import "./chatRoom.css";
import { useSocket } from "../../hooks/useSocket";
import {
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useGetUsers from "../../hooks/useGetUsers";
import Input from "../Input/Input";
import aimSound from "../../assets/sounds/aimSound.mp3";
import ChatSideBar from "../ChatSideBar/ChatSideBar";
import { formatDate } from "../../utils/formatDate";
import LoadingSpinner from "../Loading/LoadingSpinner";
import CreateChat from "../CreatChat/CreateChat";

const initialMsg = [
  {
    _id: 4567333,
    from: { _id: 66978, name: "Chatty Bot" },
    body: "It's quiet in here...",
  },
];

const audio = new Audio(aimSound);
audio.preload = "auto";

const ChatRoom = ({ userId, roomInput, setRoomInput }) => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [timeSinceTyping, setTimeSinceTyping] = useState(5);
  const [userTyping, setUserTyping] = useState(null);

  const endOfMessages = useRef(null);

  //hooks
  const allUsers = useGetUsers();
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const socket = useSocket();
  const {
    authState: { user, isAuthenticated },
  } = useAuthContext();
  const {
    chatState: { chats, isSubmitting, error },
    handleSetError,
    handleAddChat,
  } = useChatContext();

  const roomName = state?.roomName || "Chat Room";

  /**
   * @description this function creates a chat room based on the user input OR clicking on a users name. Clicking on a users name passes the other users id and creates a chatroom. If the room doesn't exist, one is created with the 2 users.
   * @param {string} name the name of the room
   * @param {string} othrUid the other user's id
   * @returns {void}
   */
  const handleJoinOrCreateRoom = (roomName, othrUid) => {
    if (!roomName) {
      handleSetError("Please enter a room name");
      return;
    }
    handleAddChat(roomName, othrUid, user._id);
    setRoomInput("");
  };

  const handleChange = (e) => {
    setMessageInput(e.target.value);
    socket.emit("typing", {
      sender: user.name,
      roomId,
    });
  };

  const scrollToBottomOfMsgs = () => {
    endOfMessages.current?.scrollIntoView();
  };

  useEffect(() => {
    scrollToBottomOfMsgs();
  }, [messages]);

  useEffect(() => {
    if (socket && isAuthenticated) {
      //this gets the messages from the room id which
      //is from the url params
      socket.emit("retrieveMessages", roomId);

      socket.on("messagesLoaded", (messages) => {
        if (messages === "no messages yet") {
          setMessages(initialMsg);
        } else {
          setMessages(messages);
        }
      });

      return () => {
        socket.off("messagesLoaded");
      };
    }
  }, [socket, roomId, isAuthenticated]);

  useEffect(() => {
    //listens for messages from the server and sets them in state.
    if (socket && isAuthenticated) {
      socket.on("receive_message", (user) => {
        audio.play();
        setMessages((prevMsgs) => [
          ...prevMsgs,
          { from: user.from, body: user.body },
        ]);
      });
      return () => {
        socket.off("receive_message");
      };
    }
  }, [socket, isAuthenticated, messages]);

  useEffect(() => {
    if (socket && isAuthenticated) {
      socket.on("otherUserTyping", (user) => {
        setTimeSinceTyping(0);
        setUserTyping(user);
      });
    }
  }, [socket, isAuthenticated, roomId]);

  useEffect(() => {
    if (timeSinceTyping < 5) {
      setTimeout(() => {
        setTimeSinceTyping((prevTime) => prevTime + 1);
      }, 1000);
    }
  }, [timeSinceTyping]);

  //listen for errors from socket server, if there is an error, set error state.
  useEffect(() => {
    if (socket) {
      socket.on("error", (error) => {
        console.log(error);
        handleSetError(error);
      });
    }
    //clear the error after 5 seconds
    return () => {
      setTimeout(() => {
        handleSetError(null);
      }, 5000);
    };
  }, [socket, error]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!messageInput.length) {
      setError("Please enter a message");
      setTimeout(() => {
        setError(null);
      }, 3000);
      return;
    }

    socket.emit("send_message", {
      body: messageInput,
      from: user._id,
      roomId,
    });
    setMessageInput("");
    setMessages((prevMsgs) => [
      ...prevMsgs,
      { from: user, body: messageInput },
    ]);
  };

  if (isSubmitting) return <LoadingSpinner />;

  return (
    <>
      <>
        <CreateChat
          handleChange={(e) => setRoomInput(e.target.value)}
          roomInput={roomInput}
          handleJoinOrCreateRoom={handleJoinOrCreateRoom}
        />

        <h1 className="chat-name">{roomName}</h1>

        <div className="chat-room">
          <div className="message-list">
            {messages.map((message) => {
              return (
                <div className="message" key={message._id}>
                  <span
                    className={
                      message.from.name === user.name
                        ? "message-body my-message"
                        : "message-body user-name"
                    }
                    key={message.from._id}
                  >
                    {/* when the message is first sent it is message.from so this is a fallback to show the initial message sent. */}
                    {message.from.name || message.from}:
                  </span>

                  <span className="message-body">
                    {message.body}
                    <span className="date-sent">
                      {formatDate(message.from.createdAt)}
                    </span>
                  </span>
                </div>
              );
            })}
            <div ref={endOfMessages}></div>
          </div>
          <form
            className="message-input"
            onSubmit={handleSendMessage}
          >
            <Input
              handleChange={handleChange}
              value={messageInput}
              name={"messageInput"}
              messageInput={messageInput}
              className="custom-input"
              placeholder="Type a message"
              type="text"
            />
            <Input className="chat-btn" type="submit" value="Send" />
          </form>
        </div>
        <div className="user-typing">
          {timeSinceTyping < 5 ? (
            <span>{userTyping} is typing...</span>
          ) : (
            ""
          )}
        </div>

        {
          //create error message to display if error
          error && <div className="error">{error}</div>
        }
      </>

      <ChatSideBar
        allUsers={allUsers}
        handleJoinOrCreateRoom={handleJoinOrCreateRoom}
        user={user}
      />
    </>
  );
};

export default ChatRoom;
