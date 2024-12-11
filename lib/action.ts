"use server";

const endpoint = "https://testnet-pay.crypt.bot/api";

import CryptoBotApi, {
  CreateCheckOptions,
  CryptoCurrencyCode,
} from "crypto-bot-api";
import { revalidatePath } from "next/cache";

const client = new CryptoBotApi(process.env.API_TOKEN || "", endpoint);

async function createPayCheck(data: CreateCheckOptions) {
  await client.createCheck(data);

  revalidatePath("/");
}

async function getBal(asset: CryptoCurrencyCode) {
  const balance = await client.getBalance(asset);

  return balance.available;
}

export { createPayCheck, getBal };
