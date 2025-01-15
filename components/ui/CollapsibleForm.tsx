"use client";

import React, { useState } from "react";
import { Disclosure, Transition } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import { useTelegramChats } from "@/hooks/useTelegramChats";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { useQueryClient } from "@tanstack/react-query";
import { HiTrash } from "react-icons/hi2";
import { useFileReader } from "@/hooks/useFileReader";
import { updateWelcomeImage } from "@/lib/supabaseAction";
import { useTranslation } from "react-i18next";

interface CollapsibleFormProps {
  chatId: string;
  id: number;
  title: string;
  placeholder: string;
  replyHolder?: string;
  type: string;
  multi: boolean;
  isOpen: boolean;
  onToggle: () => void;
  onDone: () => void;
  func?: (...args: string[]) => Promise<void>;
  deleteFunc?: (...args: string[]) => Promise<void>;
}

export default function CollapsibleForm({
  chatId,
  type,
  id,
  title,
  placeholder,
  replyHolder,
  multi,
  isOpen,
  onToggle,
  onDone,
  func,
  deleteFunc,
}: CollapsibleFormProps) {
  const { telegramChats } = useTelegramChats();
  const telegramChat = telegramChats?.find((chat) => chat.chatId === +chatId);
  const queryClient = useQueryClient();
  const [inputText, setInputText] = useState(function () {
    if (type == "welcome") return telegramChat?.message;
    return "";
  });
  const [inputReply, setInputReply] = useState("");

  const [imageFile, setImageFile] = useState<File>();
  const [imageLink, setImageLink] = useState<string>(function () {
    if (type == "image") return telegramChat?.imageUrl || "";
    return "";
  });

  useFileReader(imageFile, setImageLink);

  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteItem, setDeleteItem] = useState("");

  const { t } = useTranslation();

  function content() {
    switch (type) {
      case "blacklist":
        return telegramChat?.inappropriateKeywords;
      case "allow":
        return telegramChat?.allowedLinks;
      case "auto-reply":
        return telegramChat?.keywordReplies;
      case "admins":
        return telegramChat?.admins;
      default:
        return [];
    }
  }

  async function handleSubmission(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault();

    setIsUpdating(true);

    try {
      if (type == "image") {
        if (!imageFile) return;
        const fileName = `${chatId}-${Math.random()}-${imageFile?.name}`;
        const formData = new FormData();
        formData.append("image", imageFile);
        await updateWelcomeImage(+chatId, formData, fileName);
        queryClient.invalidateQueries({ queryKey: ["telegramChats"] });
        setImageFile(undefined);
        onDone();
        return;
      }
      if (multi) {
        if (!inputText || !inputReply) return;
        await func?.(
          chatId,
          JSON.stringify({ keyword: inputText, replyContent: inputReply })
        );
        queryClient.invalidateQueries({ queryKey: ["telegramChats"] });
        setInputText("");
        setInputReply("");
        onDone();
      } else {
        if (!inputText) return console.log(`Input: ${inputText}`);
        await func?.(chatId, inputText);
        queryClient.invalidateQueries({ queryKey: ["telegramChats"] });
        setInputText("");
        onDone();
      }
    } catch (error) {
      toast(`Error updating ${title}`, { description: `${error}` });
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleDelete(item: string) {
    try {
      setDeleteItem(item);
      setIsDeleting(true);

      await deleteFunc?.(chatId, item);
      queryClient.invalidateQueries({ queryKey: ["telegramChats"] });
    } catch (error) {
      toast(`Error deleting ${title}`, { description: `${error}` });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Disclosure
      as="div"
      className="bg-white shadow-md rounded-lg overflow-hidden mb-4"
      defaultOpen={isOpen}
    >
      {
        <>
          <Disclosure.Button
            className="flex justify-between w-full px-4 py-2 font-medium text-left text-stone-900 bg-gray-100 hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75"
            onClick={(e) => {
              e.preventDefault();
              onToggle();
            }}
          >
            <span>{title}</span>
            <ChevronUpIcon
              className={`${
                isOpen ? "transform rotate-180" : ""
              } w-5 h-5 text-orange-500 transition-transform duration-200`}
            />
          </Disclosure.Button>
          <Transition
            show={isOpen}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Disclosure.Panel
              static
              className="px-4 pt-4 pb-2 text-sm text-gray-500"
            >
              <form className="space-y-4 ">
                <div className="flex flex-wrap gap-6">
                  {content()?.map((item, index) => (
                    <div key={index}>
                      {typeof item == "object" ? (
                        <Dialog>
                          <div className="flex items-center gap-2">
                            <DialogTrigger>
                              <Button type="button" className="h-5">
                                {item.keyword}
                              </Button>
                            </DialogTrigger>
                            {isDeleting && item.keyword == deleteItem ? (
                              <ClipLoader size={20} color="#000" />
                            ) : (
                              <HiTrash
                                className="text-lg"
                                onClick={() => handleDelete(item.keyword)}
                              />
                            )}
                          </div>

                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{item.keyword}</DialogTitle>
                            </DialogHeader>
                            <p>{item.replyContent}</p>
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <div className="flex items-center gap-2">
                          <p className="bg-black text-white h-5 w-fit px-2 rounded-md">
                            {item}
                          </p>
                          {isDeleting && item == deleteItem ? (
                            <ClipLoader size={20} color="#000" />
                          ) : (
                            <HiTrash
                              className="text-lg"
                              onClick={() => handleDelete(item)}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {multi ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      id={`input-${id}`}
                      className="mt-1 block w-full rounded-md focus:outline-none shadow-md focus:ring-2 focus:ring-orange-500 h-8 px-3"
                      placeholder={placeholder}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                    />
                    <textarea
                      id={`input-${id}`}
                      className="mt-1 block w-full rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500 h-14 px-3 py-2"
                      placeholder={replyHolder}
                      value={inputReply}
                      onChange={(e) => setInputReply(e.target.value)}
                    />
                  </div>
                ) : (
                  <div>
                    {type == "welcome" ? (
                      <textarea
                        id={`input-${id}`}
                        className="mt-1 block w-full rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500 h-14 px-3 py-2"
                        placeholder={placeholder}
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                      />
                    ) : type == "image" ? (
                      <div className="flex items-center gap-2">
                        {imageLink && (
                          <img
                            src={imageLink}
                            alt="welcomeImage"
                            className="h-14 w-14 rounded-full"
                          />
                        )}
                        <label
                          htmlFor="welcomeImage"
                          className="bg-orange-500 text-white px-2 py-1 rounded-md cursor-pointer"
                        >
                          {placeholder}
                        </label>
                        <input
                          id="welcomeImage"
                          type="file"
                          accept="image/*"
                          onChange={(e) => setImageFile(e.target.files?.[0])}
                          className="hidden"
                        />
                      </div>
                    ) : (
                      <input
                        type="text"
                        id={`input-${id}`}
                        className="mt-1 block w-full rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500 h-8 px-3"
                        placeholder={placeholder}
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                      />
                    )}
                  </div>
                )}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    onClick={(e) => handleSubmission(e)}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  >
                    {isUpdating ? (
                      <ClipLoader size={20} color="#fff" />
                    ) : (
                      t("bot_configs.buttons.done")
                    )}
                  </button>
                </div>
              </form>
            </Disclosure.Panel>
          </Transition>
        </>
      }
    </Disclosure>
  );
}
