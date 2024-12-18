/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import Modal from "./Modal";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import SelectItems from "@/components/ui/SelectItems";
import Image from "next/image";
import {
  HiGiftTop,
  HiMiniArrowTopRightOnSquare,
  HiOutlineChevronRight,
  HiPhoto,
  HiUserGroup,
} from "react-icons/hi2";

import { usePublicContext } from "@/context/PublicProvider";
import noview from "@/public/noview.webp";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { CryptoCurrencyCode } from "crypto-bot-api";
import { getBal } from "@/lib/action";

import { ClipLoader } from "react-spinners";
import { useCreateCheck } from "@/hooks/useCreateCheck";
import { TicketType } from "@/lib/dataTypes";
import { useRouter } from "next/navigation";
import Link from "next/link";

const coverImages = [
  "https://oghibjysbqokcedkbicl.supabase.co/storage/v1/object/public/covers/cover1.jpg",
  "https://oghibjysbqokcedkbicl.supabase.co/storage/v1/object/public/covers/cover2.jpg",
  "https://oghibjysbqokcedkbicl.supabase.co/storage/v1/object/public/covers/cover3.jpg",
];

export default function RedForm() {
  const [selectedCover, setSelectedCover] = useState({ url: "", text: "" });
  const [selectedImage, setSelectedImage] = useState<File>();
  const [amount, setAmount] = useState<string>();
  const [balance, setBalance] = useState("");
  const [asset, setAsset] = useState<CryptoCurrencyCode>();
  const [tickets, setTickets] = useState<number>();
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState("");
  const [type, setType] = useState("fixed");

  const [password, setPassword] = useState("");

  const [errorCreating, setErrorCreating] = useState("");

  const { t } = useTranslation();

  const { setActiveId: close } = usePublicContext();

  const { createCheck, isCreating } = useCreateCheck();

  const router = useRouter();

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

  useEffect(() => {
    if (!errorCreating) return;
    setTimeout(() => setErrorCreating(""), 2000);
  }, [errorCreating]);

  async function handleCreateCheck() {
    if (!amount || !asset || !tickets)
      return setErrorCreating(
        "Provide amount, choose asset, and number of tickets"
      );

    if (mode == "password" && !password)
      return setErrorCreating("Provide a password");

    if (type == "fixed") {
      if (Number(amount) * tickets > Number(balance))
        return setErrorCreating("Insufficient balance");
    }

    if (type == "lucky") {
      if (Number(amount) > Number(balance))
        return setErrorCreating("Insufficient balance");
    }
    const data: TicketType = {
      amount: amount,
      type,
      mode,
      noOfTickets: tickets,
      cover: selectedCover.url,
      asset,
      userId: 1,
      message,
      password,
    };

    const formData = new FormData();
    formData.append("image", selectedImage as Blob);
    createCheck(
      { data, image: formData },
      {
        onSuccess: () => router.push("/"),
        onError: (error) => {
          setErrorCreating(error.message);
        },
      }
    );
  }

  function fileReader(image: FileList | null) {
    if (!image) return;
    const file = image[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      if (reader.result instanceof ArrayBuffer) return;
      setSelectedCover({ text: file.name, url: reader.result || "" });
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="">
      <div className="px-3 mt-5">
        {asset && (
          <p className="text-stone-600 text-sm font-bold mb-2">
            {t("balance.asset_balance")}: {balance}
          </p>
        )}
        <form className="">
          <div className={`flex gap-3  ${asset ? "mt-4" : "mt-8"}`}>
            <div className="bg-gray-200 rounded-xl py-1 px-2 flex items-center justify-between text-xs text-stone-700 w-full">
              <Select
                required
                onValueChange={(value) => setType(value)}
                value={type}
              >
                <SelectTrigger className="border-none text-stone-700 text-xs focus:ring-0 px-0 shadow-none">
                  <SelectValue placeholder={t("input.select_ticket_type")} />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Red packet types</SelectLabel>
                    <SelectItem value="fixed">Fixed red packet</SelectItem>
                    <SelectItem value="lucky">Lucky red packet</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-gray-200 rounded-xl py-1 px-2 flex items-center justify-between text-xs text-stone-700 w-full">
              <Select required onValueChange={(value) => setMode(value)}>
                <SelectTrigger className="border-none text-stone-700 text-xs focus:ring-0 px-0 shadow-none">
                  <SelectValue placeholder={t("input.select_ticket_mode")} />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Red packet modes</SelectLabel>
                    <SelectItem value="normal">Normal red packet</SelectItem>
                    <SelectItem value="password">
                      Password red packet
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {mode == "password" && (
            <div className="bg-gray-200 rounded-xl h-10 flex items-center justify-between mt-4 max-w-full">
              <input
                type="text"
                className="bg-transparent text-stone-600 h-full w-full px-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500  focus:ring-offset-2"
                placeholder="Enter packet password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}

          <div className="bg-gray-200 rounded-xl py-2 px-2 flex items-center justify-between mt-4 max-w-full">
            <Select
              onValueChange={(value) => setAsset(value as CryptoCurrencyCode)}
            >
              <SelectTrigger className="w-[110px] border-none text-stone-700 text-xs focus:ring-0 px-0 shadow-none">
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
              placeholder={
                type == "fixed"
                  ? t("input.placeholder_currency")
                  : "Enter total amount"
              }
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
            <Modal.Open openId="cover">
              <div className="bg-gray-200 rounded-xl py-3 px-2 flex items-center justify-between mt-4 text-xs text-stone-700">
                <div className="flex items-center gap-2">
                  <HiPhoto className="text-red-600 text-2xl" />
                  <p>{t("envelope.text")}</p>
                </div>

                <div className="flex items-center gap-2">
                  <p>{selectedCover.text || t("envelope.pick")}</p>
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
            </Modal.Open>

            <Modal.Window openId={"cover"} title={t("envelope.header")}>
              <div className="mt-5 grid grid-cols-3 gap-3 justify-items-center px-3">
                {coverImages.map((cover, index) => (
                  <div
                    className="bg-gray-200 w-[110px] rounded-xl"
                    key={cover}
                    onClick={() => {
                      setSelectedCover({
                        url: cover,
                        text: (
                          t("image_covers.covers", {
                            returnObjects: true,
                          }) as string[]
                        )[index],
                      });

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
                    <p className="text-xs px-2 text-center text-stone-600 py-2">
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
              <div className="px-3 py-5 mt-8 font-bold flex items-center gap-2 fixed bottom-0">
                <div className="flex text-white items-center px-2 py-2 bg-orange-600 hover:bg-orange-700 rounded-xl gap-1">
                  <label htmlFor="cover-image" className="text-sm">
                    Upload cover
                  </label>
                  <input
                    className="hidden"
                    id="cover-image"
                    type="file"
                    onChange={(e) => {
                      if (!e.target.files) return;
                      setSelectedImage(e.target.files[0]);
                      fileReader(e.target.files);
                      close("");
                    }}
                  />
                  <HiMiniArrowTopRightOnSquare />
                </div>
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
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full bg-orange-600 hover:bg-orange-700 rounded-xl mt-5">
                Continue
              </Button>
            </DialogTrigger>

            <DialogContent className="w-fit rounded-xl">
              <DialogTitle>Review redcard</DialogTitle>

              <div className="w-60 mx-auto">
                <div className="w-60 h-72 relative rounded-xl">
                  <Image
                    src={selectedCover.url}
                    alt=""
                    fill
                    className="object-cover rounded-xl"
                  />
                </div>

                <div className="text-center text-sm">
                  <p className="my-2">{message}</p>
                  <p className="text-xs">
                    {asset} Red envelope: {amount}
                    {asset} / {tickets} tickets
                  </p>
                  <Button
                    className="w-full mt-2 bg-orange-600 hover:bg-orange-700 rounded-xl"
                    onClick={(e) => {
                      e.preventDefault();
                      handleCreateCheck();
                    }}
                    disabled={isCreating}
                  >
                    {isCreating ? (
                      <ClipLoader color="#fff" size={20} />
                    ) : (
                      "Create"
                    )}
                  </Button>

                  {errorCreating && (
                    <p className="text-red-600 mt-1">{errorCreating}</p>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </form>
      </div>
    </div>
  );
}
