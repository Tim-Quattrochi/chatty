import { useState, useEffect, useRef } from "react";
import useAuthContext from "../../hooks/useAuthContext";
import "./chatRoom.css";
import { useSocket } from "../../hooks/useSocket";
import {
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useGetUsers from "../../hooks/useGetUsers";

const initialMsg = [
  {
    from: { _id: 66978, name: "Chatty Bot" },
    body: "It's quiet in here...",
  },
];

//create a function to convert the the date "2023-09-01T02:30:47.795Z" to a user readable format
const formatDate = (timestamp) => {
  if (!timestamp) return new Date().toLocaleDateString("en-US");

  const options = {
    month: "short",
    day: "numeric",
    year: "numeric",
    time: "EST",
  };
  const date = new Date(timestamp);
  const dateString = date.toLocaleDateString("en-US", options);
  const timeString = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${dateString} ${timeString}`;
};

const ChatRoom = ({ userId, roomInput, setRoomInput }) => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [rooms, setRooms] = useState([]);
  const [timeSinceTyping, setTimeSinceTyping] = useState(5);
  const [error, setError] = useState(null);

  const [users, setUsers] = useState([]);
  const [userTyping, setUserTyping] = useState(null);

  const endOfMessages = useRef(null);
  const { roomId } = useParams();

  const { state } = useLocation();

  const roomName = state?.roomName || "Chat Room";
  const { socket, mutualRoom } = useSocket();
  const axios = useAxiosPrivate();
  const allUsers = useGetUsers();

  const {
    authState: { user, isAuthenticated },
  } = useAuthContext();

  const navigate = useNavigate();

  /**
   * @example handleJoinRoom("1234" || roomInput)
   * @description this function creates a chat room based on the user input. If the room doesn't exist, it creates it.
   * @param {string} name the name of the room
   * @param {string} othrUid the other user's id
   * @returns {void}
   */
  const handleJoinOrCreateRoom = (name, othrUid) => {
    socket.emit("joinRoom", {
      name,
      othrUid,
      userId: user._id,
    });

    socket.on("roomJoined", (room) => {
      console.log(room);

      navigate(
        `/chat/${room._id}`,
        { state: { roomName: room.name } } || {
          state: { roomName: name },
        }
      );
    });
  };
  console.log(roomName);
  const handleChange = (e) => {
    setMessageInput(e.target.value);
    socket.emit("typing", {
      sender: user.name,
      roomId,
    });
  };

  const scrollToBottomOfMsgs = () => {
    endOfMessages.current.scrollIntoView();
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
        console.log(messages);
        if (messages === "no messages yet") {
          setMessages(initialMsg);
        } else {
          setMessages(messages);
        }
      });
    }
  }, [socket, roomId, isAuthenticated]);

  useEffect(() => {
    if (socket && isAuthenticated) {
      socket.on("roomJoined", (room) => {
        console.log(room);
      });
    }
  }, [roomId, isAuthenticated]);

  useEffect(() => {
    //listens for messages from the server and sets them in state.
    if (socket && isAuthenticated) {
      socket.on("receive_message", (user) => {
        setMessages((prevMsgs) => [
          ...prevMsgs,
          { from: user.from, body: user.body },
        ]);
      });
    }
  }, [isAuthenticated, messages]);

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
        setError(error);
      });
    }
    //clear the error after 5 seconds
    return () => {
      setTimeout(() => {
        setError(null);
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
  };

  // useEffect(() => {
  //   const audio = new Audio("./sounds/aimSound.mp3");
  //   audio.play();
  // }, [messages]);
  console.log(messages);
  return (
    <>
      <div className="create-room">
        <input
          type="text"
          value={roomInput}
          onChange={(e) => setRoomInput(e.target.value)}
          placeholder="Create a room"
        />
        <button onClick={() => handleJoinOrCreateRoom(roomInput)}>
          Create
        </button>
      </div>
      <div className="chat-name">
        <h1>{roomName}</h1>
      </div>
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
                  {message.from.name}:
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
        <form className="message-input" onSubmit={handleSendMessage}>
          <input
            type="text"
            value={messageInput}
            onChange={handleChange}
            placeholder="Type a message"
          />
          <button type="submit">Send</button>
        </form>
        <div className="sidebar">
          <ul className="other-users">
            <h2 className="other-users-title">Other users</h2>
            {/* this is mapping over ALL the users. */}
            {allUsers &&
              allUsers
                .filter((otherUser) => otherUser._id !== user._id)
                .map((otherUser) => (
                  <li
                    key={otherUser._id}
                    className="listed-users"
                    /* this creates a chat room when I click on the user name */
                    onClick={() =>
                      handleJoinOrCreateRoom(
                        `${otherUser.name} and ${user.name}'s chat`,
                        otherUser._id
                      )
                    }
                  >
                    {otherUser.name}
                  </li>
                ))}
          </ul>
        </div>
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
  );
};

export default ChatRoom;
