"use server";

const endpoint = "https://testnet-pay.crypt.bot/api";

import CryptoBotApi, { CryptoCurrencyCode } from "crypto-bot-api";
import supabase from "./supabase";

import bycrypt from "bcryptjs";

const client = new CryptoBotApi(process.env.API_TOKEN || "", endpoint);

async function getChecks() {
  const checks = await client.getChecks();
  return checks;
}

async function getBal(asset: CryptoCurrencyCode) {
  const balance = await client.getBalance(asset);

  return balance.available;
}

async function claimPacket({
  id,
  userId,
  username,
  password,
}: {
  id: number;
  userId: number;
  username: string;
  password?: string;
}) {
  const { data: packet, error } = await supabase
    .from("redcards")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  if (packet.mode == "password") {
    const packetPassword = packet.password;
    const enteredPassword = password!;
    const valid = bycrypt.compareSync(enteredPassword, packetPassword);

    if (!valid) throw new Error("Invalid password");
  }

  const unclaimed = packet.unclaimed_checks;
  const packet_amount = unclaimed.at(-1).amount;

  const cc = packet.claimed_checks?.length > 0 ? packet.claimed_checks : [];

  if (packet.noOfTickets == cc.length) throw new Error("All packets claimed");

  const claimed = cc.find((c: { userId: number }) => c.userId == userId);

  if (claimed) throw new Error("You already claimed a packet.");

  const check = await client.createCheck({
    amount: packet_amount,
    asset: packet.asset,
    pinToUserId: userId,
  });

  unclaimed.pop();
  console.log(unclaimed);

  const pc = packet.checks?.length > 0 ? packet.checks : [];
  const { error: updateError } = await supabase
    .from("redcards")
    .update({
      unclaimed_checks: unclaimed,
      claimed_checks: [
        ...cc,
        {
          checkId: check.id,
          userId,
          username,
          amount: packet_amount,
          url: check.botCheckUrl,
        },
      ],
      checks: [...pc, check.id],
    })
    .eq("id", id);
  if (updateError) throw new Error(updateError.message);

  return check.botCheckUrl;
}

export { getBal, getChecks, claimPacket };
