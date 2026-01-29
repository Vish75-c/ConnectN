import React, { useEffect } from 'react'
import { Button } from './components/ui/button'
import { BrowserRouter,Routes,Route,Navigate } from 'react-router-dom'
import Auth from './Pages/auth'
import Chat from './Pages/chat'
import Profile from './Pages/profile'
import { useAppStore } from './store'
import apiClient from './lib/api'
import { useState } from 'react'
import { GET_USER_INFO } from './utils/constants'

const PrivateRoute=({children})=>{
  const {userInfo,setUserInfo}=useAppStore();
  const isAuthenticated=!!userInfo;
  return isAuthenticated?children:<Navigate to='/auth'/>;
}

const AuthRoute=({children})=>{
  const {userInfo,setUserInfo}=useAppStore();
  const isAuthenticated=!!userInfo;
  return isAuthenticated?<Navigate to='/chat'/>:children;
}
const App = () => {
  const {userInfo,setUserInfo}=useAppStore();
  const [loading,setLoading]=useState(true);
  useEffect(()=>{
    const getUserDate=async()=>{
     try {
      const response=await apiClient.get(GET_USER_INFO,{withCredentials:true});
     
      if(response.status===200&&response.data._id){
        setUserInfo(response.data);
        console.log(userInfo);
      }else{
        setUserInfo(undefined);
      }
     } catch (error) {
      console.log({error});
     }finally{
      setLoading(false);
     }
    }
     if(!userInfo){
        getUserDate();
      }else{
        setLoading(false);
      }
  },[userInfo,setUserInfo])
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/auth' element={
        <AuthRoute>
          <Auth/>
        </AuthRoute>
        }/>
      <Route path='/chat' element={<PrivateRoute><Chat/></PrivateRoute>}/>
      <Route path='/profile' element={<PrivateRoute><Profile/></PrivateRoute>}/>
      <Route path='*' element={<Navigate to='/auth'/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App
