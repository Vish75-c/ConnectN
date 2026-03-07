import { useAppStore } from "@/store";
import React, { useEffect, useState } from "react";
import { FiPlus, FiSearch,FiHash } from "react-icons/fi";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import apiClient from "@/lib/api";
import { GET_ALL_CONTACTS_ROUTE } from "@/utils/constants";
import { Button } from "@/components/ui/button";
import MultipleSelector from "@/components/ui/multiselect";
import Lottie from "react-lottie";
import { animationDefaultOptions } from "@/lib/utils";

const CreateChannel = () => {
  const [newChannelModel, setnewChannelModel] = useState(false);
  const { userInfo, addChannel } = useAppStore();

  const [allContacts, setAllContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [channelName, setChannelName] = useState("");

  useEffect(() => {
    const getData = async () => {
      const response = await apiClient.get(GET_ALL_CONTACTS_ROUTE, {
        withCredentials: true,
      });
      setAllContacts(response.data.contacts);
    };
    getData();
  }, []);

  const createChannel = async () => {
    try {
      document.activeElement?.blur?.();
    } catch (e) { /* ignore */ }

    try {
      if (channelName.trim().length > 0 && selectedContacts.length > 0) {
        const response = await apiClient.post(
          CREATE_CHANNEL_ROUTE,
          {
            name: channelName,
            members: selectedContacts.map((contact) => contact.value),
          },
          { withCredentials: true }
        );

        if (response.status === 200) {
          setChannelName("");
          setnewChannelModel(false);
          addChannel(response.data.channel);
        }
      }
    } catch (error) {
      console.log("createChannel error:", error);
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              
              onClick={() => setnewChannelModel(true)}
              className="p-1.5 bg-[#292b36] rounded-lg text-slate-400 hover:text-white transition-all duration-300 border border-slate-800"
            >
              <FiPlus size={16} />
            </button>
          </TooltipTrigger>
          <TooltipContent className="bg-[#292b36] border-slate-700 text-white font-bold text-xs mb-2">
            <p>Create New Channel</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog
        open={newChannelModel}
        onOpenChange={(open) => {
          setnewChannelModel(open);
          if (!open) {
            setChannelName("");
            setSelectedContacts([]);
          }
        }}
      >
        <DialogContent className="bg-[#1f202a] border border-slate-800 text-white w-112.5 max-w-[90vw] h-125 md:h-130 flex flex-col p-0 overflow-hidden rounded-3xl shadow-2xl">
        
            {newChannelModel && (
              <div
              
                className="flex flex-col h-full p-6 "
              >
                <DialogHeader className="mb-4">
                  <DialogTitle className="text-xl font-black text-white tracking-tight">
                    New <span className="text-blue-500">Conversation</span>
                  </DialogTitle>
                  <DialogDescription className="text-slate-500 font-medium">
                    Please fill up the details for new channel.
                  </DialogDescription>
                </DialogHeader>

                {/* FIX: Wrap the growing content in ScrollArea */}
                <div className="flex-1 overflow-y-auto  no-scrollbar ">
                  <div className="relative mb-1 p-2">
                    <FiHash
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                      size={18}
                    />
                    <Input
                      placeholder="Channel Name"
                      className="w-full bg-[#292b36] border-slate-800 rounded-xl py-6 pl-8 text-sm focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-600"
                      onChange={(e) => setChannelName(e.target.value)}
                      value={channelName}
                    />
                  </div>

                  <div className=" p-2">
                    <MultipleSelector
                      className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white"
                      defaultOptions={allContacts}
                      placeholder="Search Contacts"
                      value={selectedContacts}
                      onChange={setSelectedContacts}
                      closeOnSelect
                      emptyIndicator={
                        <p className="text-center text-sm leading-10 text-gray-600">
                          No Result Found.
                        </p>
                      }
                    />
                  </div>

                  {selectedContacts.length === 0 && (
                    <div className="flex flex-col items-center justify-center  text-center">
                      <div className="opacity-80 scale-75">
                        <Lottie
                          isClickToPauseDisabled={true}
                          height={200}
                          width={200}
                          options={animationDefaultOptions}
                        />
                      </div>
                      <div className="mt-4">
                        <h3 className="text-lg font-bold text-white tracking-tight">
                          Start a <span className="text-blue-500">Connection</span>
                        </h3>
                        <p className="text-sm text-slate-500 font-medium mt-1">
                          Create Channel
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer section remains fixed at the bottom */}
                <div className="mt-6">
                  <div >
                    <Button
                      className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300 py-6 rounded-xl font-bold"
                      onClick={createChannel}
                      disabled={
                        !channelName.trim() || selectedContacts.length === 0
                      }
                    >
                      Create Channel
                    </Button>
                  </div>
                </div>
              </div>
            )}
    
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateChannel;