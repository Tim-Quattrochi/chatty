import { handleDispatch } from "../utils/authUtils";

/**
 * @param {string} room - the room name to be added to the chats array in state.
 * @param {function} chatDispatch - the dispatch function to be used to update state.
 * @param {string} otherUid - the other user's id.
 * @param {string} userId - the current user's id.
 * @param {object} socket - the socket object.
 * @param {function} navigate - the navigate function from react-router-dom.
 * @returns {void}
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
      handleDispatch(chatDispatch, "SET_IS_SUBMITTING", true);
      try {
        handleDispatch(chatDispatch, "ADD_CHAT", room);

        handleDispatch(chatDispatch, "SET_IS_SUBMITTING", false);
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

/**
 * @description - handles the change event for the chat room input.
 * @param {Event} e - the event object
 * @param {*} chatDispatch
 * @returns {void}
 */
const handleChange = (e, chatDispatch) => {
  handleDispatch(chatDispatch, "HANDLE_CHANGE", {
    name: e.target.name,
    value: e.target.value,
  });
};

/**
 *
 * @param {array} chats - the chats array to be loaded into state.
 * @param {function} chatDispatch - the dispatch function to be used to update state.
 * @returns {void}
 */
const loadChats = (chats, chatDispatch) => {
  handleDispatch(chatDispatch, "LOAD_CHATS", chats);
};

/**
 * @param {string} error - the error message to be set in state.
 * @param {function} chatDispatch - the dispatch function to be used to update state.
 */
const setError = (error, chatDispatch) => {
  handleDispatch(chatDispatch, "SET_ERROR", error);
};

/**
 *
 * @param {function} chatDispatch - the dispatch function to be used to update state.
 * @returns {void}
 */
const clearChatState = (chatDispatch) => {
  handleDispatch(chatDispatch, "CLEAR_CHAT_STATE", null);
};

export { addChat, handleChange, loadChats, setError, clearChatState };
