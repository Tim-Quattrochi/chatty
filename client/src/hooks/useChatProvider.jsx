import { useReducer } from "react";
import { ChatContext } from "./useChatContext";
import { chatReducer, initialState } from "../context/chatReducer";
import { useSocket } from "./useSocket";
import { handleDispatch } from "../utils/authUtils";
import useAxiosPrivate from "./useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import {
  addChat,
  handleChange,
  loadChats,
  setError,
  clearChatState,
} from "../services/chatService";

export const ChatProvider = ({ children }) => {
  const [chatState, chatDispatch] = useReducer(
    chatReducer,
    initialState
  );

  //hooks
  const navigate = useNavigate();
  const axios = useAxiosPrivate();
  const socket = useSocket();

  /**
   * @description Helper function that calls addChat from the chatService.
   * @param {string} roomName - The room name that will be passed to addChat from the chatService, same as "room" parameter from addChat in the chatService.
   * @param {string} otherUid - The other user's id that will be passed to addChat from the chatService, same as "otherUid" parameter from addChat in the chatService.
   * @param {string} userId - The user's id that will be passed to addChat from the chatService, same as "userId" parameter from addChat in the chatService.
   */
  const handleAddChat = (roomName, otherUid, userId) => {
    try {
      //make sure socket is available before adding chat

      addChat(
        roomName,
        chatDispatch,
        otherUid,
        userId,
        socket,
        navigate
      );
    } catch (error) {
      console.log(error);
    }
  };
  /**
   * @description Helper function that calls handleChange from the chatService.
   * @param {Event} e - the event object
   */
  const handleInputChange = (e) => {
    handleChange(e, chatDispatch);
  };

  /**
   * @description Helper function that calls loadChats from the chatService and sets isSubmitting to false.
   * @returns {void}
   */
  const handleLoadChats = async () => {
    try {
      const getRooms = async () => {
        const { data } = await axios.get("/chat/all");

        loadChats(data, chatDispatch);

        return data;
      };

      await getRooms();
      handleDispatch(chatDispatch, "SET_IS_SUBMITTING", false);
    } catch (error) {
      console.log(error);
    }
  };

  /**
   *@description Helper function that calls setError from the chatService.
   * @param {string} error - the error message that will be passed to setError from the chatService.
   */
  const handleSetError = (error) => {
    setError(error, chatDispatch);
  };

  /**
   * @description Helper function that calls clearChatState from the chatService.
   */
  const handleClearChatState = () => {
    clearChatState(chatDispatch);
  };

  return (
    <ChatContext.Provider
      value={{
        chatState,
        chatDispatch,
        handleAddChat,
        handleInputChange,
        handleLoadChats,
        handleSetError,
        handleClearChatState,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
