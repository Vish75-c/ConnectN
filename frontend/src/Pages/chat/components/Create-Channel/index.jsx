import { useAppStore } from "@/store";
import React, { useEffect, useState } from "react";
import { FiPlus, FiHash } from "react-icons/fi";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import apiClient from "@/lib/api";
import { GET_ALL_CONTACTS_ROUTE } from "@/utils/constants";
import { Button } from "@/components/ui/button";
import MultipleSelector from "@/components/ui/multiselect";
import Lottie from "react-lottie";
import { animationDefaultOptions } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const CreateChannel = () => {
  const [newChannelModel, setnewChannelModel] = useState(false);
  const { addChannel } = useAppStore();
  const [allContacts, setAllContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [channelName, setChannelName] = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await apiClient.get(GET_ALL_CONTACTS_ROUTE, { withCredentials: true });
        setAllContacts(response.data.contacts || []);
      } catch (e) { console.log(e); }
    };
    if (newChannelModel) getData();
  }, [newChannelModel]);

  const createChannel = async () => {
    if (channelName.trim().length > 0 && selectedContacts.length > 0) {
      const response = await apiClient.post(
        CREATE_CHANNEL_ROUTE,
        { name: channelName, members: selectedContacts.map((c) => c.value) },
        { withCredentials: true }
      );
      if (response.status === 201 || response.status === 200) {
        setnewChannelModel(false);
        addChannel(response.data.channel);
      }
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setnewChannelModel(true)}
              className="p-1.5 bg-[#292b36] rounded-lg text-slate-400 border border-slate-800"
            >
              <FiPlus size={16} />
            </motion.button>
          </TooltipTrigger>
          <TooltipContent className="bg-[#292b36] text-white font-bold text-xs mb-2">
            Create New Channel
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={newChannelModel} onOpenChange={(open) => {
        setnewChannelModel(open);
        if (!open) { setChannelName(""); setSelectedContacts([]); }
      }}>
        {/* EXACT ORIGINAL DIMENSIONS RESTORED */}
        <DialogContent className="bg-[#1f202a] border border-slate-800 text-white w-112.5 max-w-[90vw] h-125 md:h-130 flex flex-col p-0 overflow-hidden rounded-3xl shadow-2xl">
          <AnimatePresence>
            {newChannelModel && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="flex flex-col h-full p-6">
                <DialogHeader className="mb-4">
                  <DialogTitle className="text-xl font-black">
                    New <span className="text-blue-500">Conversation</span>
                  </DialogTitle>
                  <DialogDescription className="text-slate-500">Fill up the details for new channel.</DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto scrollbar-hide">
                  <div className="relative mb-1 p-2">
                    <FiHash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <Input
                      placeholder="Channel Name"
                      className="w-full bg-[#292b36] border-slate-800 rounded-xl py-6 pl-8"
                      onChange={(e) => setChannelName(e.target.value)}
                      value={channelName}
                    />
                  </div>

                  <div className="p-2">
                    <MultipleSelector
                      className="rounded-lg bg-[#2c2e3b] border-none text-white"
                      defaultOptions={allContacts}
                      placeholder="Search Contacts"
                      value={selectedContacts}
                      onChange={setSelectedContacts}
                      emptyIndicator={<p className="text-center text-sm py-4 text-gray-600">No Result Found.</p>}
                    />
                  </div>

                  {selectedContacts.length === 0 && (
                    <div className="flex flex-col items-center justify-center text-center mt-4">
                      <Lottie height={200} width={200} options={animationDefaultOptions} />
                      <h3 className="text-lg font-bold">Start a <span className="text-blue-500">Connection</span></h3>
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <Button
                    className="w-full bg-purple-700 hover:bg-purple-900 py-6 rounded-xl font-bold"
                    onClick={createChannel}
                    disabled={!channelName.trim() || selectedContacts.length === 0}
                  >
                    Create Channel
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateChannel;