import React, { useState, useRef, useEffect } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoMdSend } from "react-icons/io";
import { RiEmojiStickerLine } from "react-icons/ri";
import EmojiPicker from "emoji-picker-react";
import { useAppStore } from "@/store";
import { useSocket } from "@/context/socketContext";

const MessageBar = () => {
  const emojiRef = useRef(null);
  const socket = useSocket();

  const [message, setMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  const { selectedChatType, selectedChatData, userInfo } = useAppStore();

  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  const handleSendMessage = async () => {
    if (!socket || !socket.emit) {
      console.log("Socket not ready yet");
      return;
    }

    if (!message.trim()) return;

    if (selectedChatType === "contact") {
      socket.emit("sendMessage", {
        sender: userInfo._id,
        content: message,
        recipient: selectedChatData._id,
        messageTypes: "text",
        fileUrl: undefined,
      });
    }else if(selectedChatType==='channel'){
      socket.emit("send-channel-message",{
        send:userInfo._id,
        content:message,
        messageType:"text",
        fileUrl:undefined,
        channelId:selectedChatData._id
      })
    }

    setMessage("");
  };

  return (
    <div className="bg-[#1c1d25] flex items-center w-full px-2 md:px-6 mb-4 gap-2 md:gap-6">
      
      {/* Input Area */}
      <div className="flex flex-1 bg-[#2a2b33] rounded-md items-center gap-3 px-3 relative">

        <input
          type="text"
          className="flex-1 p-3 md:p-5 bg-transparent rounded-md focus:outline-none text-white"
          placeholder="Enter Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button className="text-neutral-400 hover:text-white transition-all">
          <GrAttachment className="text-xl md:text-2xl" />
        </button>

        <button
          onClick={() => setEmojiPickerOpen((prev) => !prev)}
          className="text-neutral-400 hover:text-white transition-all"
        >
          <RiEmojiStickerLine className="text-xl md:text-2xl" />
        </button>

        {emojiPickerOpen && (
          <div
            ref={emojiRef}
            className="absolute bottom-14 right-0 z-50 scale-90 md:scale-100"
          >
            <EmojiPicker
              theme="dark"
              onEmojiClick={handleAddEmoji}
              autoFocusSearch={false}
            />
          </div>
        )}
      </div>

      {/* Send Button */}
      <button
        onClick={handleSendMessage}
        className="bg-[#8417ff] rounded-md flex items-center justify-center p-3 md:p-5 hover:bg-[#741bda] transition-all"
      >
        <IoMdSend className="text-xl md:text-2xl text-white" />
      </button>
    </div>
  );
};

export default MessageBar;