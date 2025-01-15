"use client";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { HiGiftTop, HiOutlineChevronRight, HiPhoto } from "react-icons/hi2";
import { useTranslation } from "react-i18next";
import { CryptoCurrencyCode } from "crypto-bot-api";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SelectItems from "@/components/ui/SelectItems";
import { getBal } from "@/lib/action";
import { TicketType } from "@/lib/dataTypes";
import { useCreateCheck } from "@/hooks/useCreateCheck";
import Modal from "./Modal";
import Cover from "./Cover";
import Review from "./Review";
import SecondaryNav from "./SecondaryNav";

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
  const [createdId, setCreatedId] = useState<number>();

  const queryClient = useQueryClient();

  const { t } = useTranslation();

  const { createCheck, isCreating, isSuccess } = useCreateCheck();

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
        onSuccess: async (data) => {
          setCreatedId(data.id);
          await queryClient.invalidateQueries();
        },
        onError: (error) => {
          setErrorCreating(error.message);
        },
      }
    );
  }

  function handleDeposit() {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openTelegramLink(
        "https://t.me/redcardfestivalbot?start=deposit"
      );
      window.Telegram.WebApp.close();
    }
  }

  return (
    <>
      <SecondaryNav to="/">
        <p>{t("create_red_cards")}</p>
      </SecondaryNav>

      <div className="">
        <div className="px-3 mt-5">
          {asset && (
            <div className="flex items-center gap-2 mb-2">
              <p className="text-stone-600 text-sm font-bold ">
                {t("balance.asset_balance")}: {balance}
              </p>
              <Button
                className="h-4 bg-orange-600 hover:bg-orange-700 text-xs"
                onClick={handleDeposit}
              >
                {t("balance.deposit")}
              </Button>
            </div>
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
                      <SelectLabel>{t("red_packet_type.title")}</SelectLabel>
                      <SelectItem value="fixed">
                        {t("red_packet_type.type1")}
                      </SelectItem>
                      <SelectItem value="lucky">
                        {t("red_packet_type.type2")}
                      </SelectItem>
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
                      <SelectLabel>{t("red_packet_mode.title")}</SelectLabel>
                      <SelectItem value="normal">
                        {t("red_packet_mode.mode1")}
                      </SelectItem>
                      <SelectItem value="password">
                        {t("red_packet_mode.mode2")}
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

              <Modal.Window openId={"cover"} title={t("envelope.header")}>
                <Cover
                  setSelectedCover={setSelectedCover}
                  setSelectedImage={setSelectedImage}
                />
              </Modal.Window>
            </Modal>

            <textarea
              placeholder={t("message.placeholder")}
              className="mt-4 ring-2 ring-orange-500 px-2 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-xl focus:ring-offset-2"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <Review
              selectedCover={selectedCover}
              message={message}
              asset={asset}
              tickets={tickets}
              amount={amount}
              errorCreating={errorCreating}
              createdId={createdId}
              isCreating={isCreating}
              isSuccess={isSuccess}
              handleCreateCheck={handleCreateCheck}
            />
          </form>
        </div>
      </div>
    </>
  );
}
