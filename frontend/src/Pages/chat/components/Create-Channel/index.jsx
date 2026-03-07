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
const CreateChannel = () => {
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
           
          </ScrollArea>
          
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateChannel;
