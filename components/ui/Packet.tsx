"use client";

import { useRedPackets } from "@/hooks/useRedPackets";
import Image from "next/image";
import { Button } from "./button";
import { usePublicContext } from "@/context/PublicProvider";
import { useClaimPacket } from "@/hooks/useClaimPacket";
import WebApp from "@twa-dev/sdk";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./dialog";
import { useState } from "react";
import { HiMiniShare } from "react-icons/hi2";
import { createTelegramShareLink } from "@/lib/utils";

const supabaseUrl = "https://oghibjysbqokcedkbicl.supabase.co";
const defaultImage =
  "https://oghibjysbqokcedkbicl.supabase.co/storage/v1/object/public/covers/defaultCover.jpg";

function Packet({ id }: { id: string }) {
  const { userId, username } = usePublicContext();
  // const userId = 2;
  // const username = "me";
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { redpackets } = useRedPackets();
  const { claimRedPacket, isPending } = useClaimPacket();
  const packet = redpackets?.find((redpacket) => redpacket.id == +id);

  const claimed = packet?.claimed_checks?.find(
    (check) => check.userId == userId
  );

  function handleClaim() {
    if (!userId || !username) return;
    claimRedPacket(
      {
        id: +id,
        userId,
        username,
        password,
      },

      {
        onError: () => setError("you are unable to claim packet"),
        onSuccess: () => setError(""),
      }
    );
  }

  async function handleShare(createdId: number | undefined) {
    const url = createTelegramShareLink(
      `https://t.me/redcardfestivalbot?startapp=${createdId}`,
      "claim red packet"
    );
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openTelegramLink(url);
    }
  }

  return (
    <div className="w-4/5 mx-auto mt-5 bg-gray-200 rounded-xl relative">
      <div className="absolute z-50 top-0 left-0 flex justify-between gap-2 w-full">
        <div className="bg-black rounded-lg text-white px-2 py-1">
          <HiMiniShare onClick={() => handleShare(packet?.id)} />
        </div>
      </div>
      <div className="relative w-full h-96 rounded-xl">
        <Image
          src={
            packet?.cover.startsWith(supabaseUrl) ? packet?.cover : defaultImage
          }
          alt=""
          fill
          className="object-cover rounded-xl"
        />
      </div>

      <div className="mt-3 px-2 py-2 text-sm text-stone-600 text-center">
        {packet?.message && <p className="text-sm mb-2">{packet.message}</p>}
        <p className="font-bold">
          {packet?.asset} red packet {packet?.amount}
          {packet?.asset} / {packet?.noOfTickets} packets
        </p>
        <p className="text-xs text-orange-700 text-center px-2 pb-2">
          Available {packet?.unclaimed_checks?.length} / {packet?.noOfTickets}
        </p>

        {claimed && (
          <div className="text-center px-3 text-stone-500">
            <p>Click link to get your prize.</p>
            <p
              onClick={() => WebApp.openTelegramLink(claimed.url)}
              className="text-orange-500 mb-1 mt-1"
            >
              {claimed.url}
            </p>
          </div>
        )}

        {packet?.mode == "normal" ? (
          <Button
            className="w-full rounded-xl bg-orange-600 hover:bg-orange-700"
            onClick={handleClaim}
            disabled={Boolean(claimed)}
          >
            {claimed ? "claimed" : isPending ? "Claiming..." : "Claim"}
          </Button>
        ) : (
          <Dialog>
            <DialogTrigger className="w-full">
              <Button className="w-full rounded-xl bg-orange-600 hover:bg-orange-700">
                Grab ticket
              </Button>
            </DialogTrigger>
            <DialogContent className="w-fit">
              <DialogTitle>Enter password</DialogTitle>

              <div className="w-60 mx-auto">
                <input
                  type="text"
                  className="bg-gray-200 text-stone-600 w-full px-2 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500  focus:ring-offset-2"
                  placeholder="Enter packet password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <Button
                  className="w-full rounded-xl bg-orange-600 hover:bg-orange-700 mt-2"
                  onClick={handleClaim}
                  disabled={Boolean(claimed)}
                >
                  {claimed ? "claimed" : isPending ? "Claiming..." : "Claim"}
                </Button>

                {error && <p className="text-red-600 mt-1">{error}</p>}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}

export default Packet;
