"use server";

const endpoint = "https://testnet-pay.crypt.bot/api";

import CryptoBotApi, { CreateCheckOptions } from "crypto-bot-api";
import { revalidatePath } from "next/cache";

const client = new CryptoBotApi(process.env.API_TOKEN || "", endpoint);

async function getMe() {
  const data = await client.getMe();
  return data;
}

async function createCheck(data: CreateCheckOptions) {
  await client.createCheck(data);

  revalidatePath("/");
}

async function getChecks() {
  const checks = await client.getChecks();
  return checks;
}

export { getMe, createCheck, getChecks };
