import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import io from "socket.io-client";
import useAuthContext from "./useAuthContext";

const SocketContext = createContext();

// eslint-disable-next-line react/prop-types
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [mutualRoom, setMutualRoom] = useState(null);

  const {
    authState: { isAuthenticated, user },
  } = useAuthContext();

  useEffect(() => {
    if (!socket && isAuthenticated) {
      const newSocket = io("http://localhost:3001");
      newSocket.on("connected", () => {
        newSocket.emit("handshake", user._id);
      });
      newSocket.on("chatCreated", (room) => {
        setMutualRoom(room);
      });
      setSocket(newSocket);
    }

    if (socket) {
      return () => {
        socket.disconnect();
      };
    }
  }, [isAuthenticated]);

  return (
    <SocketContext.Provider value={{ socket, mutualRoom }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
