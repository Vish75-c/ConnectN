import React, { useEffect, useRef } from "react";
import { useAppStore } from "@/store";

const MessageContainer = () => {
  const {
    selectedChatMessages ,
    selectedChatType,
    userInfo,
  } = useAppStore();

  const bottomRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    console.log(selectedChatMessages);
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChatMessages]);

  const isOwnMessage = (message) => {
    const senderId =
      typeof message.sender === "object"
        ? message.sender._id
        : message.sender;

    return senderId === userInfo?._id;
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[65vw] w-full">
      <div className="flex flex-col gap-3">
        {selectedChatMessages.map((message, index) => {
          const own = isOwnMessage(message);

          return (
            <div
              key={message._id || index}
              className={`flex ${own ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-xl px-4 py-2 text-sm break-words
                  ${
                    own
                      ? "bg-[#8417ff] text-white rounded-br-none"
                      : "bg-[#2a2b33] text-white rounded-bl-none"
                  }`}
              >
                {message.messageTypes === "text" && (
                  <p>{message.content}</p>
                )}

                <span className="text-[10px] opacity-60 mt-1 block text-right">
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default MessageContainer;
