import { useContext, createContext } from "react";

export const AuthContext = createContext({});
/**
 * @description  Custom hook to Make it easier to access AuthContext.
 *  @returns {object}  The value of AuthContext
 */
const useAuthContext = () => {
  return useContext(AuthContext);
};

export default useAuthContext;
