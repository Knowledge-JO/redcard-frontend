"use client";

import { useRedPackets } from "@/hooks/useRedPackets";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { HiMiniArrowTopRightOnSquare } from "react-icons/hi2";
import { Button } from "./button";
import Navbar from "./Navbar";

const defaultImage =
  "https://oghibjysbqokcedkbicl.supabase.co/storage/v1/object/public/covers/defaultCover.jpg";
const supabaseUrl = "https://oghibjysbqokcedkbicl.supabase.co";
function Home() {
  const { t } = useTranslation();

  const { redpackets } = useRedPackets();

  return (
    <div>
      <Navbar />

      <div className="mt-8 px-3 grid grid-cols-2 gap-x-2 gap-y-5 justify-items-center mb-16">
        {redpackets?.length == 0 ? (
          <div className="">
            <p className="text-stone-600">{t("checks.zero")}</p>
          </div>
        ) : (
          redpackets?.map((redpacket) => (
            <Link href={`/packet/${redpacket.id}`} key={redpacket.id}>
              <div className="bg-gray-200 rounded-xl max-w-48">
                <div className="relative w-full h-44 rounded-xl">
                  <Image
                    src={
                      redpacket.cover.startsWith(supabaseUrl)
                        ? redpacket.cover
                        : defaultImage
                    }
                    alt=""
                    fill
                    className="object-cover rounded-xl"
                  />
                </div>

                <div className="px-5 mt-2">
                  <p className="text-sm text-stone-600 text-center  font-bold">
                    {redpacket.asset} red packet {redpacket.amount}
                    {redpacket.asset} / {redpacket.noOfTickets} Packs
                  </p>
                  <p className="text-xs text-orange-700 text-center  pb-2">
                    Available{" "}
                    {redpacket.unclaimed_checks?.length ||
                      redpacket.noOfTickets}{" "}
                    / {redpacket.noOfTickets}
                  </p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      <div className="px-3 py-5 mt-8 font-bold flex items-center gap-2 fixed bottom-0">
        <Link href={"/create"}>
          <Button className="bg-orange-600 hover:bg-orange-700">
            <p>{t("create_new_envelopes")}</p>
            <HiMiniArrowTopRightOnSquare />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
