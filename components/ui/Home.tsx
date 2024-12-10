"use client";

import { HiOutlineClipboardDocument } from "react-icons/hi2";
import Navbar from "./Navbar";

const checks = [
  {
    id: 1413533,
    hash: "CQVD288cvZnC",
    asset: "TON",
    amount: "0.01",
    botCheckUrl: "https://t.me/CryptoTestnetBot?start=CQVD288cvZnC",
    status: "activated",
    createdAt: "2024-12-09T23:44:32.515Z",
    activatedAt: "2024-12-09T23:44:53.120Z",
  },
  {
    id: 12786,
    hash: "THIDJcvZnC",
    asset: "TON",
    amount: "0.01",
    botCheckUrl: "https://t.me/CryptoTestnetBot?start=CQVD288cvZnC",
    status: "activated",
    createdAt: "2024-12-09T23:44:32.515Z",
    activatedAt: "2024-12-09T23:44:53.120Z",
  },
];

function truncateText(text: string) {
  const a = text.slice(8, 14);
  const b = text.slice(text.length - 5);

  return `${a}...${b}`;
}

function Home() {
  async function handleCopy(data: string) {
    try {
      await navigator.clipboard.writeText(data);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
      <Navbar />

      <div className="mt-8 px-3 grid grid-cols-2 gap-x-2 gap-y-5 justify-items-center">
        {checks.map((check) => (
          <div className="bg-gray-200 w-40 px-3 py-3 rounded-xl" key={check.id}>
            <p className="text-stone-500">TicketId: {check.id} </p>

            <p className="text-gray-500">
              Status:{" "}
              <span
                className={`${
                  check.status == "active"
                    ? "bg-green-500 text-green-900"
                    : "bg-yellow-500 text-yellow-900"
                } px-2 py-1 text-xs rounded-xl`}
              >
                {check.status}
              </span>
            </p>

            <div className="flex items-center gap-2 mt-3">
              <p className="text-blue-600 text-sm">
                {truncateText(check.botCheckUrl)}
              </p>
              <HiOutlineClipboardDocument
                className="text-lg"
                onClick={() => handleCopy(check.botCheckUrl)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
