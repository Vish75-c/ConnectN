import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import {io} from 'socket.io-client'
import { createContext,useContext,useEffect,useRef } from "react"; 
const SocketContext=createContext(null);

export const userSocket=()=>{
    return useContext(SocketContext);
}

export const SocketProvider=({children})=>{
    const socket=useRef();
    const {userInfo}=useAppStore();
    useEffect(()=>{
        if(userInfo){
            socket.current=io(HOST,{
                withCredentials:true,
                query:{userId:userInfo._id},
            })
            socket.current.on("connect",()=>{
                console.log("Connected to socket Server");
            })
            return ()=>{
                socket.current.disconnect();
            }
        }
    },[userInfo])
    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    )
}
