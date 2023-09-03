import { useEffect, useReducer, useState } from "react";
import { ChatContext } from "./useChatContext";
import { chatReducer, initialState } from "../context/chatReducer";
import { useSocket } from "./useSocket";
import { handleDispatch } from "../utils/authUtils";
import { APP_NAME } from "../config/constants";
import useAxiosPrivate from "./useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import {
  addChat,
  handleChange,
  loadChats,
  setError,
} from "../services/chatService";

// eslint-disable-next-line react/prop-types
export const ChatProvider = ({ children }) => {
  const [chatState, chatDispatch] = useReducer(
    chatReducer,
    initialState
  );

  const navigate = useNavigate();
  const axios = useAxiosPrivate();
  const { socket } = useSocket();

  /**
   * @description this function creates a chat room based on the user input. If the room doesn't exist, it creates it. If the other users id is provided, it adds them to the room.
   * @param {string} room - the name of the room
   * @param {string} otherUid - the other user's id(optional)
   * @returns {void}
   */
  const handleAddChat = async (roomName, otherUid, userId) => {
    try {
      //make sure socket is available before adding chat

      await addChat(
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

  const handleInputChange = (e) => {
    handleChange(e, chatDispatch);
  };

  const handleLoadChats = async () => {
    handleDispatch(chatDispatch, "SET_IS_SUBMITTING", true);
    try {
      const getRooms = async () => {
        const { data } = await axios.get("/chat/all");

        loadChats(data, chatDispatch);
        return data;
      };
      handleDispatch(chatDispatch, "SET_IS_SUBMITTING", false);
      await getRooms();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSetError = (error) => {
    setError(error, chatDispatch);
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
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
