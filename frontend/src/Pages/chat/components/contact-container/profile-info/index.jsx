import React from "react";
import * as Avatar from "@radix-ui/react-avatar";
import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { getColor } from "@/lib/utils";

const ProfileInfo = () => {
  const { userInfo } = useAppStore();

  if (!userInfo) return null;

  return (
    <div className="absolute bottom-0 h-16 w-full bg-[#2a2b33] flex items-center px-6">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <Avatar.Root
          className={`h-10 w-10 rounded-full overflow-hidden flex items-center justify-center ${getColor(
            userInfo.color
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
      </div>
    </div>
  );
};

export default ProfileInfo;
