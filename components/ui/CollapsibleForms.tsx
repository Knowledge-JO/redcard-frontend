"use client";

import React, { useState } from "react";
import CollapsibleForm from "./CollapsibleForm";
import { useTelegramChats } from "@/hooks/useTelegramChats";
import { MoonLoader } from "react-spinners";
import SecondaryNav from "./SecondaryNav";
import {
  removeAdmin,
  removeInappropriateWord,
  removeKeywordReply,
  removeLink,
  updateAdmins,
  updateAllowedLinks,
  updateInappropiateWords,
  updateKeywordReplies,
  updateWelcomeMessage,
} from "@/lib/supabaseAction";

const formsData = [
  {
    id: 0,
    type: "admins",
    title: "Add dashboard admin",
    placeholder: "Enter admin username",
    func: updateAdmins,
    deleteFunc: removeAdmin,
    multi: false,
  },
  {
    id: 1,
    type: "image",
    title: "Update welcome image",
    placeholder: "Chose image",
    multi: false,
  },
  {
    id: 2,
    type: "welcome",
    title: "Update welcome message",
    placeholder: "Enter welcome message",
    func: updateWelcomeMessage,
    multi: false,
  },
  {
    id: 3,
    type: "blacklist",
    title: "Blacklist words",
    func: updateInappropiateWords,
    deleteFunc: removeInappropriateWord,
    placeholder: "Enter words to blacklist, separated by commas",
    multi: false,
  },
  {
    id: 4,
    type: "allow",
    title: "Allow links",
    placeholder: "Enter links to allow, separated by commas",
    func: updateAllowedLinks,
    deleteFunc: removeLink,
    multi: false,
  },
  {
    id: 5,
    type: "auto-reply",
    title: "Update auto reply keywords",
    placeholder: "Enter keyword",
    replyHolder: "Enter reply",
    func: updateKeywordReplies,
    deleteFunc: removeKeywordReply,
    multi: true,
  },
];

export default function CollapsibleForms({ chatId }: { chatId: string }) {
  const [openForm, setOpenForm] = useState<number | null>(null);

  const { telegramChats, fetchingChats } = useTelegramChats();

  const telegramChat = telegramChats?.find((chat) => chat.chatId == +chatId);

  const toggleForm = (id: number) => {
    setOpenForm(openForm === id ? null : id);
  };

  const handleDone = () => {
    setOpenForm(null);
  };

  if (fetchingChats)
    return (
      <div className="flex justify-center mt-10 w-full">
        <MoonLoader size={30} color="" />
      </div>
    );

  return (
    <>
      <SecondaryNav to="/config"> {telegramChat?.chatName || ""}</SecondaryNav>

      <div className="max-w-3xl mx-auto p-4 space-y-4">
        <h1 className="text-2xl font-bold mb-6 text-orange-600">
          Bot Configurations
        </h1>
        {formsData.map((form) => (
          <CollapsibleForm
            key={form.id}
            chatId={chatId}
            id={form.id}
            type={form.type}
            title={form.title}
            placeholder={form.placeholder}
            replyHolder={form.replyHolder}
            func={form.func}
            deleteFunc={form.deleteFunc}
            multi={form.multi}
            isOpen={openForm === form.id}
            onToggle={() => toggleForm(form.id)}
            onDone={handleDone}
          />
        ))}
      </div>
    </>
  );
}
