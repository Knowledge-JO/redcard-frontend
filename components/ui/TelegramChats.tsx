"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useTelegramChats } from "@/hooks/useTelegramChats";
import { MoonLoader } from "react-spinners";
import { useTranslation } from "react-i18next";
import SecondaryNav from "./SecondaryNav";

export default function TelegramChats() {
  const { telegramChats, fetchingChats } = useTelegramChats();

  const { t } = useTranslation();

  if (fetchingChats)
    return (
      <div className="flex justify-center mt-10 w-full">
        <MoonLoader size={30} color="#FF7F50" />
      </div>
    );
  return (
    <>
      <SecondaryNav to="/">{t("telegram_chat.chats")}</SecondaryNav>
      <div className="max-w-md mx-auto mt-10 bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-orange-500 font-semibold mb-4">
            {t("telegram_chat.text")}
          </div>
          <ul className="space-y-3">
            {telegramChats?.length == 0 && (
              <div>{t("telegram_chat.message")}</div>
            )}
            {telegramChats?.map((content, id) => (
              <Link key={content.chatId} href={`config/${content.chatId}`}>
                <li className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition duration-150 ease-in-out cursor-pointer">
                  <span className="text-gray-600 mr-3">{id + 1}.</span>
                  <span className="text-gray-800 flex-grow">
                    {content.chatName}
                  </span>
                  <ChevronRight className="text-gray-400" size={20} />
                </li>
              </Link>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
