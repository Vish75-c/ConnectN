import React, { useState, useRef } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoMdSend } from "react-icons/io";
import { RiEmojiStickerLine } from "react-icons/ri";
import EmojiPicker from "emoji-picker-react";

const MessageBar = () => {
  const emojiRef = useRef();
  const [message, setMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  const handleSendMessage = async () => {
    if (message.trim() === "") return;
    console.log("Send message:", message);
    setMessage("");
  };

  return (
    <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5 relative">
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
          <div className="absolute bottom-16 right-0 z-50">
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
