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
import { useTranslation } from "react-i18next";

export default function CollapsibleForms({ chatId }: { chatId: string }) {
  const [openForm, setOpenForm] = useState<number | null>(null);

  const { telegramChats, fetchingChats } = useTelegramChats();

  const telegramChat = telegramChats?.find((chat) => chat.chatId == +chatId);

  const { t } = useTranslation();

  const formsData = [
    {
      id: 0,
      type: "admins",
      title: t("bot_configs.add_admin"),
      placeholder: t("bot_configs.placeholders.admin_form"),
      func: updateAdmins,
      deleteFunc: removeAdmin,
      multi: false,
    },
    {
      id: 1,
      type: "image",
      title: t("bot_configs.welcome_img"),
      placeholder: t("bot_configs.placeholders.welcome_img"),
      multi: false,
    },
    {
      id: 2,
      type: "welcome",
      title: t("bot_configs.welcome_msg"),
      placeholder: t("bot_configs.placeholders.welcome_msg"),
      func: updateWelcomeMessage,
      multi: false,
    },
    {
      id: 3,
      type: "blacklist",
      title: t("bot_configs.blacklist"),
      func: updateInappropiateWords,
      deleteFunc: removeInappropriateWord,
      placeholder: t("bot_configs.placeholders.blacklist"),
      multi: false,
    },
    {
      id: 4,
      type: "allow",
      title: t("bot_configs.allow_links"),
      placeholder: t("bot_configs.placeholders.allow_links"),
      func: updateAllowedLinks,
      deleteFunc: removeLink,
      multi: false,
    },
    {
      id: 5,
      type: "auto-reply",
      title: t("bot_configs.keyword_reply"),
      placeholder: t("bot_configs.placeholders.keyword_reply"),
      replyHolder: t("bot_configs.placeholders.reply_holder"),
      func: updateKeywordReplies,
      deleteFunc: removeKeywordReply,
      multi: true,
    },
  ];

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
          {t("bot_configs.title")}
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
