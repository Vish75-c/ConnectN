import React, { useEffect, useRef } from "react";
import { useAppStore } from "@/store";
import moment from "moment";
import axios from "axios";
import apiClient from "@/lib/api";
import { GET_MESSAGES_ROUTE } from "@/utils/constants";

const MessageContainer = () => {
  const {
    selectedChatMessages,
    selectedChatData,
    setSelectedChatMessages,
    selectedChatType,
    userInfo,
  } = useAppStore();

  useEffect(() => {
    const getMessage=async ()=>{
      try {
        const response=await apiClient.post(GET_MESSAGES_ROUTE,{_id:selectedChatData._id},{withCredentials:true})
        if(response.data.messages){
          setSelectedChatMessages(response.data.messages);
        }
      
      } catch (error) {
        console.log(error);
      }
    }
    if(selectedChatData._id){
      if(selectedChatType==='contact')getMessage();
    }
  }, [
    selectedChatData,
    selectedChatType,
    setSelectedChatMessages,
  ]);
  const scrollRef = useRef(null);

  const renderMessages = () => {
    let lastDate = null;

    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;

      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}

          {selectedChatType === "contact" && renderDmMessages(message)}
          {selectedChatType==='channel'&&renderChannelMessages(message)}
        </div>
      );
    });
  };

  const renderDmMessages = (message) => {
    const isMyMessage = message.sender === userInfo._id;

    return (
      <div className={isMyMessage ? "text-right" : "text-left"}>
        <div
          className={`${
            isMyMessage
              ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
              : "bg-[#2a2b33]/5 text-white/80 border-white/20"
          } border inline-block p-4 rounded my-1 max-w-[50%] wrap-break-words`}
        >
          {message.content}
        </div>

        <div className="text-xs text-gray-600">
          {moment(message.timestamp).format("LT")}
        </div>
      </div>
    );
  };
  const renderChannelMessages = (message) => {
  const isMyMessage = message.sender._id === userInfo._id;

  return (
    <div className={`flex ${isMyMessage ? "justify-end" : "justify-start"} my-2`}>
      <div className="max-w-[60%]">
        {!isMyMessage && (
          <div className="text-xs text-white/60 mb-1">
            {message.sender.firstName} {message.sender.lastName}
          </div>
        )}

        <div
          className={`${
            isMyMessage
              ? "bg-[#8417ff]/10 text-[#8417ff] border-[#8417ff]/40"
              : "bg-[#2a2b33]/10 text-white border-white/20"
          } border px-4 py-2 rounded-lg`}
        >
          {message.content}
        </div>

        <div className="text-[10px] text-gray-500 mt-1 text-right">
          {moment(message.timestamp).format("LT")}
        </div>
      </div>
    </div>
  );
}
  useEffect(() => {
  if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide mx-auto p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[65vw] w-full">
      {renderMessages()}
      <div ref={scrollRef}></div>
    </div>
  );
};

export default MessageContainer;
