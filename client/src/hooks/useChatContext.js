import { useContext } from "react";
import { ChatContext } from "../context/chatContext";

/**
 * @description  Custom hook to Make it easier to access AuthContext.
 *  @returns {object}  The value of ChatContext
 */
const useAuthContext = () => {
  return useContext(ChatContext);
};

export default useAuthContext;
