import React from 'react'
import ChatHeader from './components/chat-header'
import MessageBar from './components/message-bar'
import MessageContainer from './components/message-container'

const ChatContainer = () => {
  return (
    <div className='h-screen w-full bg-[#1c1d25] flex flex-col '>
      <ChatHeader/>
      <MessageContainer/>
      <MessageBar/>
    
    </div>
  )
}

export default ChatContainer
