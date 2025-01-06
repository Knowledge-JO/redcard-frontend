"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useTelegramChats } from "@/hooks/useTelegramChats";
import { MoonLoader } from "react-spinners";

export default function TelegramChats() {
  const { telegramChats, fetchingChats } = useTelegramChats();
  console.log(telegramChats);
  if (fetchingChats)
    return (
      <div className="flex justify-center mt-10 w-full">
        <MoonLoader size={30} color="" />
      </div>
    );
  return (
    <div className="max-w-md mx-auto mt-10 bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div className="p-8">
        <div className="uppercase tracking-wide text-sm text-orange-500 font-semibold mb-4">
          Telegram chats
        </div>
        <ul className="space-y-3">
          {telegramChats?.length == 0 && <div>No chats</div>}
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
  );
}
