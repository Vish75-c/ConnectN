import React from 'react'
import { Button } from './components/ui/button'
import { BrowserRouter,Routes,Route,Navigate } from 'react-router-dom'
import Auth from './Pages/auth'
import Chat from './Pages/chat'
import Profile from './Pages/profile'
const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/auth' element={<Auth/>}/>
      <Route path='/chat' element={<Chat/>}/>
      <Route path='/profile' element={<Profile/>}/>
      <Route path='*' element={<Navigate to='/auth'/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App
