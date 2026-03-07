import React, { useState, useRef, useEffect } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoMdSend } from "react-icons/io";
import { RiEmojiStickerLine } from "react-icons/ri";
import EmojiPicker from "emoji-picker-react";
import { useAppStore } from "@/store";
import { useSocket } from "@/context/socketContext";


const MessageBar = () => {
  const emojiRef = useRef();
  const socket=useSocket();
  const [message, setMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const {selectedChatType,selectedChatData,userInfo}=useAppStore();
  useEffect(()=>{
    function handleClickOutside(event){
        if(emojiRef.current&&!emojiRef.current.contains(event.target)){
            setEmojiPickerOpen(false);
        }
        
    }
    document.addEventListener("mousedown",handleClickOutside);
        return ()=>{
            document.removeEventListener("mousedown",handleClickOutside);
        }
  },[emojiRef])
  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  const handleSendMessage = async () => {
    if (!socket || !socket.emit) {
    console.log("Socket not ready yet");
    return;
  }
    if(selectedChatType==='contact'){
      socket.emit("sendMessage",{
        sender:userInfo._id,
        content:message,
        recipient:selectedChatData._id,
        messageTypes:'text',
        fileUrl:undefined
      })
    }
  };

  return (
    <div className=" bg-[#1c1d25] flex justify-center items-center  mb-6 gap-6">
      <div className="flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5 relative">
        <input
          type="text"
          className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
          placeholder="Enter Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all">
          <GrAttachment className="text-2xl" />
        </button>
        <button
          onClick={() => setEmojiPickerOpen((prev) => !prev)}
          className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
        >
          <RiEmojiStickerLine className="text-2xl" />
        </button>

        {emojiPickerOpen && (
          <div ref={emojiRef} className="absolute bottom-16 right-0 z-50">
            <EmojiPicker
              theme="dark"
              onEmojiClick={handleAddEmoji}
              autoFocusSearch={false}
            />
          </div>
        )}
      </div>

      <button
        onClick={handleSendMessage}
        className="bg-[#8417ff] rounded-md flex items-center justify-center p-5 hover:bg-[#741bda] focus:bg-[#741bda] focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
      >
        <IoMdSend className="text-2xl" />
      </button>
    </div>
  );
};

export default MessageBar;
