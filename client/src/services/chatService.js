import { handleDispatch } from "../utils/authUtils";

/**
 *
 * @param {string} room - the room name to be added to the chats array in state.
 */
const addChat = async (
  roomName,
  chatDispatch,
  otherUid,
  userId,
  socket,
  navigate
) => {
  try {
    socket.emit("joinRoom", {
      roomName,
      otherUid,
      userId,
    });

    await socket.on("roomJoined", (room) => {
      try {
        handleDispatch(chatDispatch, "SET_IS_SUBMITTING", true);
        handleDispatch(chatDispatch, "ADD_CHAT", room);

        navigate(
          `/chat/${room._id}`,
          { state: { roomName: room.roomName } } || {
            state: { roomName: name },
          }
        );
      } catch (err) {
        console.log(err);
        handleDispatch(chatDispatch, "SET_IS_SUBMITTING", false);
      }
    });
  } catch (err) {
    console.log(err);
  }
};

const handleChange = (e, chatDispatch) => {
  handleDispatch(chatDispatch, "HANDLE_CHANGE", {
    name: e.target.name,
    value: e.target.value,
  });
};

const loadChats = (chats, chatDispatch) => {
  handleDispatch(chatDispatch, "LOAD_CHATS", chats);
};

const setError = (error, chatDispatch) => {
  handleDispatch(chatDispatch, "SET_ERROR", error);
};

const clearChatState = (chatDispatch) => {
  handleDispatch(chatDispatch, "CLEAR_CHAT_STATE", null);
};

export { addChat, handleChange, loadChats, setError, clearChatState };
