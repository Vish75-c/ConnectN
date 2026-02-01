import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaPlus } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import * as Avatar from "@radix-ui/react-avatar";
import Lottie from "react-lottie";
import { animationDefaultOptions } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import apiClient from "@/lib/api";
import { SEARCH_CONTACTS_ROUTES } from "@/utils/constants";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
const NewDm = () => {
  const [openNewContactModel, setOpenNewContactModal] = useState("");
  const [searchedContacts, setSearchedContacts] = useState([]);
  const {setSelectedChatType,setSelectedChatData}=useAppStore();
  const selectNewContact=async (contact)=>{
    setOpenNewContactModal(false);
    setSearchedContacts([]);
    setSelectedChatType("contact");
    setSelectedChatData(contact);
    
  }
  const searchContacts = async (searchTerm) => {
    try {
      if (searchTerm.length > 0) {
        const response = await apiClient.post(
          SEARCH_CONTACTS_ROUTES,
          { searchTerm },
          { withCredentials: true },
        );
        if (response.status === 200 && response.data.contacts) {
          setSearchedContacts(response.data.contacts);
        }
      } else {
        setSearchedContacts([]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              onClick={() => setOpenNewContactModal(true)}
              className="text-neutral-400 font-light top-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3">
            <p>Select New Contact</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={openNewContactModel} onOpenChange={setOpenNewContactModal}>
        <DialogContent className="bg-[#181920] border-none text-white w-100 h-100 flex flex-col">
          <DialogHeader>
            <DialogTitle>Please Select the contact</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeHolder="Search Contacts"
              className="rounded-lg p-6 bg-[#2c3e3b] border-none"
              onChange={(e) => searchContacts(e.target.value)}
            />
          </div>
          <ScrollArea className="h-62">
            <div className="flex flex-col gap-5">
              {searchedContacts.map((contact) => (
                <div
                onClick={()=>selectNewContact(contact)}
                  key={contact._id}
                  className="flex gap-3 items-center cursor-pointer hover:bg-[#2a2b33] p-2 rounded-lg transition"
                >
                  <Avatar.Root
                    className={`h-10 w-10 rounded-full overflow-hidden flex items-center justify-center ${getColor(
                      contact.color,
                    )}`}
                  >
                    {contact.image ? (
                      <Avatar.Image
                        src={`${HOST}/${contact.image}`}
                        alt="profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Avatar.Fallback className="uppercase text-white font-semibold">
                        {contact.firstName?.[0]}
                        {contact.lastName?.[0]}
                      </Avatar.Fallback>
                    )}
                  </Avatar.Root>

                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">
                      {contact.firstName} {contact.lastName} 
                    </span>
                    <span className="text-sm font-bold text-neutral-500">{contact.email}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          {searchedContacts.length <= 0 && (
            <div className="flex-1 md:bg-[#1c1d25] md:flex flex-col justify-center items-center duration-1000 transition-all">
              <Lottie
                isClickToPauseDisabled={true}
                height={180}
                width={200}
                options={animationDefaultOptions}
              />
              <div className="text-opacity-80 text-white flex flex-col gap-5 mt-5 lg:text-4xl transition-all duration-300 text-center">
                <h1 className="poppins-medium">
                  <span className="text-purple-500"></span> Hi Search new
                  Contacts
                  <br />
                  <span className="text-purple-500"> ConnectN! </span>
                </h1>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewDm;
