import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { io } from "socket.io-client";
import { createContext, useContext, useEffect, useRef, useState } from "react";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const { userInfo } = useAppStore();

  useEffect(() => {
    if (!userInfo) return;

    const s = io(HOST, {
      withCredentials: true,
      query: { userId: userInfo._id }, // JWT later
    });

    socketRef.current = s;
    setSocket(s); // 🔥 THIS triggers re-render

    s.on("connect", () => {
      console.log("Connected to socket server");
    });

    const handleReceiveMessage = (message) => {
      const {
        selectedChatData,
        selectedChatType,
        addMessage,
      } = useAppStore.getState();

      if (
        selectedChatType &&
        selectedChatData &&
        (selectedChatData._id === message.sender._id ||
          selectedChatData._id === message.recipient._id)
      ) {
        console.log(message);
        addMessage(message);
      }
    };

    s.on("receiveMessage", handleReceiveMessage);

    return () => {
      s.off("receiveMessage", handleReceiveMessage);
      s.disconnect();
      socketRef.current = null;
      setSocket(null);
    };
  }, [userInfo]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
