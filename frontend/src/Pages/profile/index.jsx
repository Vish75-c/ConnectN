import { useAppStore } from "@/store";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { IoMdAdd, IoMdArrowBack, IoMdTrash } from "react-icons/io";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { getColor, colors } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import apiClient from "@/lib/api";
import { useRef } from "react";
import { UPDATE_PROFILE_ROUTE } from "@/utils/constants";
const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const fileInputRef = useRef(null);
  // useEffect(()=>{
  //   if(userInfo.pro){
  //     setFirstName(userInfo.firstName);
  //     setLastName(userInfo.lastName);
  //     setSelectedColor(userInfo.color);
  //   }
  // },[userInfo])

  const validateProfile = () => {
    if (!firstName) {
      toast.error("First Name is required");
      return false;
    }
    if (!lastName) {
      toast.error("Last Name is required");
      return false;
    }
    return true;
  };
  const saveChanges = async () => {
    if (validateProfile()) {
      try {
        const response = await apiClient.post(
          UPDATE_PROFILE_ROUTE,
          { firstName, lastName, color: selectedColor },
          { withCredentials: true },
        );

        if (response.status === 200) {
          if (response.data) {
            setUserInfo(response.data);
            toast.success("Profile Updated Successfully");
            navigate("/chat");
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };
  const handleImageChange = async (event) => {
   
    const file=event.target.files[0];
    console.log(file);
    if(file){
      const formData=new FormData();
      
    }
  };
  const handleDeleteImage = async () => {};
  return (
    <div className="bg-[#1b1c24] min-h-screen flex items-center justify-center">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        {/* Back button */}
        <IoMdArrowBack
          onClick={() => navigate(-1)}
          className="text-4xl lg:text-6xl text-white/90 cursor-pointer"
        />

        <div className="grid grid-cols-2 gap-10">
          {/* Avatar */}
          <div
            className="relative flex items-center justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar
              className={`h-32 w-32 md:h-48 md:w-48 rounded-full overflow-hidden 
              flex items-center justify-center 
              ${getColor(selectedColor)}`}
            >
              {image ? (
                <AvatarImage
                  src={image}
                  alt="profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="uppercase text-white text-5xl font-semibold">
                  {firstName ? firstName[0] : userInfo?.email?.[0]}
                </div>
              )}
            </Avatar>

            {/* Hover overlay */}
            {hovered && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer"
                onClick={image ? handleDeleteImage : handleFileInputClick}
              >
                {image ? (
                  <IoMdTrash className="text-white text-3xl" />
                ) : (
                  <IoMdAdd className="text-white text-3xl" />
                )}
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
              name="profile-image"
              accept=".png,.jpg,.jpeg,.svg,.webp"
            />
          </div>

          {/* Inputs */}
          <div className="flex flex-col gap-5 text-white justify-center">
            <Input
              disabled
              value={userInfo?.email || ""}
              className="rounded-lg p-4 bg-[#2c2e3b] border-none"
            />

            <Input
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="rounded-lg p-4 bg-[#2c2e3b] border-none"
            />

            <Input
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="rounded-lg p-4 bg-[#2c2e3b] border-none"
            />

            {/* Color Picker */}
            <div className="flex gap-3 flex-wrap">
              {colors.map((color, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedColor(index)}
                  className={`h-8 w-8 rounded-full cursor-pointer 
                  transition-all duration-300 ${color}
                  ${
                    selectedColor === index ? " outline-2 outline-white/50" : ""
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <Button
          onClick={saveChanges}
          className="h-14 w-full rounded-lg bg-purple-700 hover:bg-purple-800 transition-all duration-300 text-white font-semibold"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default Profile;
