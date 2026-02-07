import { useAppStore } from "@/store";
import React from "react";
import { RiCloseFill } from "react-icons/ri";
import * as Avatar from "@radix-ui/react-avatar";
import { getColor } from "@/lib/utils";
const ChatHeader = () => {
  const { closeChat, selectedChatData,selectedChatType } = useAppStore();
  const handleCloseChat = () => {
    console.log("VIsited");
    closeChat();
  };
  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20">
      <div className="flex gap-5 flex-row items-center justify-between w-full">
        {selectedChatType==='contact'&&<div className="flex items-center gap-3">
          {/* Avatar */}
          <Avatar.Root
            className={`h-10 w-10 rounded-full overflow-hidden flex items-center justify-center ${getColor(
              selectedChatData.color,
            )}`}
          >
            {selectedChatData.image ? (
              <Avatar.Image
                src={`${HOST}/${selectedChatData.image}`}
                alt="profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <Avatar.Fallback className="uppercase text-white font-semibold">
                {selectedChatData.firstName?.[0]}
                {selectedChatData.lastName?.[0]}
              </Avatar.Fallback>
            )}
          </Avatar.Root>
          {/* Name + Email */}
          <div className="flex flex-col">
            <span className="text-white font-medium">
              {selectedChatData.firstName} {selectedChatData.lastName}
            </span>
          </div>
        </div>}
        <div className="flex items-center justify-center">
          <button
            onClick={handleCloseChat}
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
          >
            <RiCloseFill className="text-3xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
