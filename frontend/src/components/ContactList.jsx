import { useAppStore } from "@/store";
import React from "react";
import * as Avatar from "@radix-ui/react-avatar";
import { HOST } from "@/utils/constants";
import { getColor } from "@/lib/utils";

const ContactList = ({ contacts, isChannel = false }) => {
  const {
    selectedChatData,
    setSelectedChatData,
    setSelectedChatType,
    setSelectedChatMessages,
  } = useAppStore();

  const handleClick = (contact) => {
    const type = isChannel ? "channel" : "contact";
    setSelectedChatType(type);

    // clear messages if switching chat
    if (!selectedChatData || selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]);
    }

    setSelectedChatData(contact);
  };

  return (
    <div className="mt-5">
      {contacts.map((contact) => {
        const isSelected = selectedChatData?._id === contact._id;

        return (
          <div
            key={contact._id}
            onClick={() => handleClick(contact)}
            className={`
              pl-10 py-2 cursor-pointer transition-all duration-200
              ${isSelected
                ? "bg-[#8417ff] text-white"
                : "hover:bg-[#f1f1f111] text-neutral-300"}
            `}
          >
            <div className="flex gap-5 items-center">
              {!isChannel && (
                <div className="flex items-center gap-3">
                  <Avatar.Root
                    className={`h-10 w-10 rounded-full overflow-hidden flex items-center justify-center ${getColor(
                      contact.color
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

                  <span className="font-medium">
                    {contact.firstName} {contact.lastName}
                  </span>
                </div>
              )}

              {isChannel && (
                <>
                  <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">
                    #
                  </div>
                  <span>{contact.name}</span>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ContactList;
