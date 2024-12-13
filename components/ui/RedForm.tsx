/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/Modal";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SelectItems from "@/components/ui/SelectItems";
import Image from "next/image";
import {
  HiGiftTop,
  // HiOutlineChevronRight,
  // HiPhoto,
  // HiUserGroup,
} from "react-icons/hi2";

import { usePublicContext } from "@/context/PublicProvider";
import noview from "@/public/noview.webp";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { CryptoCurrencyCode } from "crypto-bot-api";
import { getBal } from "@/lib/action";

import { ClipLoader } from "react-spinners";
import { useCreateCheck } from "@/hooks/useCreateCheck";

const coverImages = [
  "https://oghibjysbqokcedkbicl.supabase.co/storage/v1/object/public/covers/cover1.jpg",
  "https://oghibjysbqokcedkbicl.supabase.co/storage/v1/object/public/covers/cover2.jpg",
  "https://oghibjysbqokcedkbicl.supabase.co/storage/v1/object/public/covers/cover3.jpg",
];

export default function RedForm() {
  const [selectedCover, setSelectedCover] = useState("");
  const [amount, setAmount] = useState<string>();
  const [balance, setBalance] = useState("");
  const [asset, setAsset] = useState<CryptoCurrencyCode>();
  const [tickets, setTickets] = useState<number>();

  const [isCreating, setIsCreating] = useState(false);

  const [errorCreating, setErrorCreating] = useState("");

  const { t } = useTranslation();

  const { setActiveId: close } = usePublicContext();

  const { createCheck } = useCreateCheck(tickets!);

  useEffect(() => {
    async function balance() {
      try {
        if (!asset) return;
        const bal = await getBal(asset);
        console.log(bal);
        setBalance(bal);
      } catch (error) {
        console.log(error);
      }
    }

    balance();

    return () => {};
  }, [asset]);

  async function handleCreateCheck() {
    if (!amount || !asset || !tickets) return;
    setIsCreating(true);
    createCheck(
      { amount, asset },
      {
        onSuccess: () => close(""),
        onError: (error) => {
          setErrorCreating(
            +balance < +amount * tickets
              ? "Insufficient balance, please deposit via the bot."
              : "Error creating tickets"
          );
          setIsCreating(false);
        },
      }
    );
  }

  return (
    <div className="">
      {/* <div className="bg-gray-200 text-stone-500 px-3 py-3 flex items-center justify-between max-w-lg mx-auto">
        <HiArrowLeftOnRectangle
          className="text-2xl"
          onClick={() => router.push("/")}
        />

        <p>Create red card</p>
      </div> */}

      <div className="px-3 mt-5 ">
        {asset && (
          <p className="text-stone-600 text-sm font-bold mb-2">
            {t("balance.asset_balance")}: {balance}
          </p>
        )}
        <form className="">
          <div className="bg-gray-200 rounded-xl py-2 px-2 flex items-center justify-between">
            <Select
              onValueChange={(value) => setAsset(value as CryptoCurrencyCode)}
            >
              <SelectTrigger className="w-[90px] border-none text-stone-700 text-xs focus:ring-0 px-0 shadow-none">
                <SelectValue placeholder={t("input.select_currency")} />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{t("input.currency_title")}</SelectLabel>
                  <SelectItems />
                </SelectGroup>
              </SelectContent>
            </Select>

            <input
              type="number"
              min={0}
              required
              className="bg-transparent text-right px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-lg focus:ring-offset-2"
              placeholder={t("input.placeholder_currency")}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="bg-gray-200 rounded-xl py-3 px-2 flex items-center justify-between mt-4 text-xs text-stone-700">
            <div className="flex items-center gap-2">
              <HiGiftTop className="text-red-600 text-2xl" />
              <p>{t("tickets.text")}</p>
            </div>

            <input
              type="number"
              min={1}
              className="bg-transparent text-right px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-lg focus:ring-offset-2"
              placeholder={t("tickets.placeholder_ticket")}
              onChange={(e) => setTickets(Number(e.target.value))}
            />
          </div>

          <Modal>
            {/* <Modal.Open openId="cover">
              <div className="bg-gray-200 rounded-xl py-3 px-2 flex items-center justify-between mt-4 text-xs text-stone-700">
                <div className="flex items-center gap-2">
                  <HiPhoto className="text-red-600 text-2xl" />
                  <p>{t("envelope.text")}</p>
                </div>

                <div className="flex items-center gap-2">
                  <p>{selectedCover || t("envelope.pick")}</p>
                  <HiOutlineChevronRight />
                </div>
              </div>
            </Modal.Open>

            <Modal.Open openId="telegram">
              <div className="bg-gray-200 rounded-xl py-3 px-2 flex items-center justify-between mt-4 text-xs text-stone-700">
                <div className="flex items-center gap-2">
                  <HiUserGroup className="text-yellow-500 text-2xl" />
                  <p>{t("telegram_channel.text")}</p>
                </div>

                <HiOutlineChevronRight />
              </div>
            </Modal.Open> */}

            <Modal.Window openId={"cover"} title={t("envelope.header")}>
              <div className="mt-5 grid grid-cols-3 gap-3 justify-items-center px-3">
                {coverImages.map((cover, index) => (
                  <div
                    className="bg-gray-200 w-[120px]  rounded-xl"
                    key={cover}
                    onClick={() => {
                      setSelectedCover(
                        (
                          t("image_covers.covers", {
                            returnObjects: true,
                          }) as string[]
                        )[index]
                      );

                      close("");
                    }}
                  >
                    <div className="relative h-44 rounded-xl">
                      <Image
                        src={cover}
                        alt=""
                        fill
                        className="object-cover rounded-xl"
                      />
                    </div>
                    <p className="text-xs text-center text-stone-600 py-2">
                      {
                        (
                          t("image_covers.covers", {
                            returnObjects: true,
                          }) as string[]
                        )[index]
                      }
                    </p>
                  </div>
                ))}
              </div>
            </Modal.Window>

            <Modal.Window
              openId={"telegram"}
              title={t("telegram_channel.header")}
            >
              <div className="mt-10 flex justify-center">
                <div>
                  <div className="relative h-44 w-44">
                    <Image src={noview} fill alt="" className="object-cover" />
                  </div>
                  <p className="text-stone-500 text-center font-bold">
                    {t("telegram_channel.message")}
                  </p>
                </div>
              </div>
            </Modal.Window>
          </Modal>

          <textarea
            placeholder={t("message.placeholder")}
            className="mt-4 ring-2 ring-orange-500 px-2 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-xl focus:ring-offset-2"
          />

          <Button
            className="w-full bg-orange-600 hover:bg-orange-700 rounded-xl mt-5"
            onClick={(e) => {
              e.preventDefault();
              handleCreateCheck();
            }}
            disabled={isCreating}
          >
            {isCreating ? (
              <ClipLoader color="#fff" size={20} />
            ) : (
              t("submit_button.text")
            )}
          </Button>

          {errorCreating && (
            <p className="text-red-600 mt-1">{errorCreating}</p>
          )}
        </form>
      </div>
    </div>
  );
}
