import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { io } from "socket.io-client";
import { createContext, useContext, useEffect, useRef, useState } from "react";

const SocketContext = createContext(null);//create global socket context

export const useSocket = () => useContext(SocketContext); //access socket anywhere in the components create global socket container. Any compoent can use socket instead of passing props


//this is wrapped inside the main body 
export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);  //store socket without re-render
  const [socket, setSocket] = useState(null); //trigger re-render when socket ready
  const { userInfo } = useAppStore();

  useEffect(() => {
    if (!userInfo) return;

    const s = io(HOST, {   //connect frontend with the backend socket  server and also send userId which is used to create socketId
      withCredentials: true,
      query: { userId: userInfo._id }, 
    });

    socketRef.current = s;
    setSocket(s); // THIS triggers re-render

    s.on("connect", () => {
      console.log("Connected to socket server");
    });

    const handleReceiveMessage = (message) => {  //when ever server send msg run this
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
    const handleReceiveChannelMessage=(message)=>{
      console.log(message);
      const {selectedChatData,selectedChatType,addMessage}=useAppStore.getState();
      if(selectedChatType!==undefined&&selectedChatData._id===message.channelId){
        addMessage(message);
      }
    }
    s.on("receiveMessage", handleReceiveMessage);
    s.on("receive-channel-message",handleReceiveChannelMessage);
    return () => {  //when user logs out the listener is removed and socket is disconnected
      s.off("receiveMessage", handleReceiveMessage);
      s.off("receive-channel-message",handleReceiveChannelMessage);
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
