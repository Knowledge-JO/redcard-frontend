"use client";

import {
  HiMiniArrowTopRightOnSquare,
  HiMiniDocumentCheck,
  HiOutlineClipboardDocument,
} from "react-icons/hi2";
import Navbar from "./Navbar";
import { useTranslation } from "react-i18next";
import { Check } from "crypto-bot-api";
import { useState } from "react";
import { Button } from "./button";
import { useRouter } from "next/navigation";

// const checks = [
//   {
//     id: 1413533,
//     hash: "CQVD288cvZnC",
//     asset: "TON",
//     amount: "0.01",
//     botCheckUrl: "https://t.me/CryptoTestnetBot?start=CQVD288cvZnC",
//     status: "activated",
//     createdAt: "2024-12-09T23:44:32.515Z",
//     activatedAt: "2024-12-09T23:44:53.120Z",
//   },
//   {
//     id: 12786,
//     hash: "THIDJcvZnC",
//     asset: "TON",
//     amount: "0.01",
//     botCheckUrl: "https://t.me/CryptoTestnetBot?start=CQVD288cvZnC",
//     status: "activated",
//     createdAt: "2024-12-09T23:44:32.515Z",
//     activatedAt: "2024-12-09T23:44:53.120Z",
//   },
// ];

function truncateText(text: string) {
  const a = text.slice(8, 14);
  const b = text.slice(text.length - 5);

  return `${a}...${b}`;
}

function Home({ checks }: { checks: Check[] }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState("");

  const router = useRouter();

  async function handleCopy(data: string) {
    try {
      setCopied(data);
      await navigator.clipboard.writeText(data);
      setTimeout(() => setCopied(""), 2000);
    } catch (error) {
      console.log(error);
    }
  }

  function formatDate(date: Date) {
    const readable = new Date(date).toLocaleString();
    return readable;
  }

  return (
    <div>
      <Navbar />

      <div className="mt-8 px-3 grid grid-cols-2 gap-x-2 gap-y-5 justify-items-center mb-16">
        {checks.map((check) => (
          <div
            className="bg-gray-200 max-w-40 px-3 py-3 rounded-xl relative"
            key={check.id}
          >
            <div className="bg-orange-600 text-stone-100 w-fit px-2 py-1 rounded-lg flex items-center justify-center text-sm absolute -top-0 left-0">
              <p>{check.amount}</p>
              <p>{check.asset}</p>
            </div>
            <p className="text-stone-600 font-bold text-sm mt-8">
              {t("checks.ticket_id")}: {check.id}{" "}
            </p>

            <p className="text-stone-600">
              {t("checks.status")}:{" "}
              <span
                className={`${
                  check.status == "active"
                    ? "bg-green-500 text-green-900"
                    : "bg-yellow-500 text-yellow-900"
                } px-2 py-1 text-xs rounded-xl`}
              >
                {check.status == "active"
                  ? t("checks_active.status")
                  : t("checks_activated.status")}
              </span>
            </p>

            <div className="flex items-center gap-2 mt-3">
              <p className="text-blue-600 text-sm">
                {truncateText(check.botCheckUrl)}
              </p>
              {copied == check.botCheckUrl ? (
                <HiMiniDocumentCheck className="text-green-700" />
              ) : (
                <HiOutlineClipboardDocument
                  className="text-lg"
                  onClick={() => handleCopy(check.botCheckUrl)}
                />
              )}
            </div>

            <div className="mt-3">
              <p className="text-sm text-stone-500">
                CreatedAt:{" "}
                <span className="text-xs">{formatDate(check.createdAt)}</span>
              </p>

              {check.activatedAt && (
                <p className="text-sm text-stone-500 mt-2">
                  ActivatedAt:{" "}
                  <span className="text-xs">
                    {formatDate(check.activatedAt)}
                  </span>
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="px-3 mt-8 font-bold flex items-center gap-2 fixed bottom-0">
        <Button
          className="bg-orange-600 hover:bg-orange-700"
          onClick={() => router.push("/create")}
        >
          <p> Create new envelopes</p>
          <HiMiniArrowTopRightOnSquare />
        </Button>
      </div>
    </div>
  );
}

export default Home;
