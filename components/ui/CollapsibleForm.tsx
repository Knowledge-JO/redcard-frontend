"use client";

import React, { useState } from "react";
import { Disclosure, Transition } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";

interface CollapsibleFormProps {
  chatId: string;
  id: number;
  title: string;
  placeholder: string;
  replyHolder?: string;
  multi: boolean;
  isOpen: boolean;
  onToggle: () => void;
  onDone: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  func: (...args: string[]) => Promise<void>;
}

export default function CollapsibleForm({
  chatId,
  id,
  title,
  placeholder,
  replyHolder,
  multi,
  isOpen,
  onToggle,
  onDone,
  func,
}: CollapsibleFormProps) {
  const [inputText, setInputText] = useState("");
  const [inputReply, setInputReply] = useState("");

  const [isUpdating, setIsUpdating] = useState(false);

  async function handleSubmission(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault();

    setIsUpdating(true);

    try {
      if (multi) {
        if (!inputText || !inputReply) return;
        await func(
          chatId,
          JSON.stringify({ keyword: inputText, replyContent: inputReply })
        );
        setInputText("");
        setInputReply("");
        onDone();
      } else {
        if (!inputText) console.log(`Input: ${inputText}`);
        await func(chatId, inputText);
        setInputText("");
        onDone();
      }
    } catch (error) {
      toast(`Error updating ${title}`, { description: `${error}` });
    } finally {
      setIsUpdating(false);
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
            className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-stone-900 bg-gray-100 hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75"
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
                    <input
                      type="text"
                      id={`input-${id}`}
                      className="mt-1 block w-full rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500 h-8 px-3"
                      placeholder={placeholder}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                    />
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
                      "Done"
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
