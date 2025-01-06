"use client";

import React, { useState } from "react";
import CollapsibleForm from "./CollapsibleForm";
import { useTelegramChats } from "@/hooks/useTelegramChats";
import { MoonLoader } from "react-spinners";
import SecondaryNav from "./SecondaryNav";
import {
  updateAllowedLinks,
  updateInappropiateWords,
  updateKeywordReplies,
  updateWelcomeMessage,
} from "@/lib/supabaseAction";

const formsData = [
  {
    id: 1,
    title: "Update welcome message",
    placeholder: "Enter welcome message",
    func: updateWelcomeMessage,
    multi: false,
  },
  {
    id: 2,
    title: "Blacklist words",
    func: updateInappropiateWords,
    placeholder: "Enter words to blacklist, separated by commas",
    multi: false,
  },
  {
    id: 3,
    title: "Allow links",
    placeholder: "Enter links to allow, separated by commas",
    func: updateAllowedLinks,
    multi: false,
  },
  {
    id: 4,
    title: "Update auto reply keywords",
    placeholder: "Enter keyword",
    replyHolder: "Enter reply",
    func: updateKeywordReplies,
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

  const handleDone = (id: number) => {
    console.log(`Form ${id} marked as done`);
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
            title={form.title}
            placeholder={form.placeholder}
            replyHolder={form.replyHolder}
            func={form.func}
            multi={form.multi}
            isOpen={openForm === form.id}
            onToggle={() => toggleForm(form.id)}
            onDone={() => handleDone(form.id)}
          />
        ))}
      </div>
    </>
  );
}
