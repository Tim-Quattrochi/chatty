import { useContext, createContext } from "react";

export const ChatContext = createContext({});
/**
 * @description  Custom hook to Make it easier to access ChatContext.
 *  @returns {object}  The value of ChatContext
 */
const useChatContext = () => {
  return useContext(ChatContext);
};

export default useChatContext;
