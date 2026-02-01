import React from "react";
import * as Avatar from "@radix-ui/react-avatar";
import { useAppStore } from "@/store";
import { HOST, LOGOUT_ROUTE } from "@/utils/constants";
import { getColor } from "@/lib/utils";
import { FiEdit2 } from "react-icons/fi";
import {IoPowerSharp} from 'react-icons/io5'
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import apiClient from "@/lib/api";
const ProfileInfo = () => {
  const { userInfo,setUserInfo } = useAppStore();
  const navigate=useNavigate();
  if (!userInfo) return null;
  const logOut=async()=>{
    try {
      const response=await apiClient.post(LOGOUT_ROUTE,{},{withCredentials:true});
      // console.log(response);
      if(response.status===200){
        navigate('/auth');
        setUserInfo(null);
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="absolute bottom-0 h-16 w-full bg-[#2a2b33] flex items-center px-6">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <Avatar.Root
          className={`h-10 w-10 rounded-full overflow-hidden flex items-center justify-center ${getColor(
            userInfo.color,
          )}`}
        >
          {userInfo.image ? (
            <Avatar.Image
              src={`${HOST}/${userInfo.image}`}
              alt="profile"
              className="h-full w-full object-cover"
            />
          ) : (
            <Avatar.Fallback className="uppercase text-white font-semibold">
              {userInfo.firstName?.[0]}
              {userInfo.lastName?.[0]}
            </Avatar.Fallback>
          )}
        </Avatar.Root>
        {/* Name + Email */}
        <div className="flex flex-col">
          <span className="text-white font-medium">
            {userInfo.firstName} {userInfo.lastName}
          </span>
        </div>
        <div className="flex gap-5">
          <Tooltip>
            <TooltipTrigger>
              <FiEdit2 onClick={()=>navigate('/profile')} className="text-purple-500 text-xl font-medium" />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white">
              <p>Edit Profile</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <IoPowerSharp onClick={logOut} className="text-red-700 text-xl font-medium" />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white">
              <p>Logout</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
