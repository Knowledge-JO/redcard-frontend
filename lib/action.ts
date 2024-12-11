"use server";

const endpoint = "https://testnet-pay.crypt.bot/api";

import CryptoBotApi, { CreateCheckOptions } from "crypto-bot-api";
import { revalidatePath } from "next/cache";

const client = new CryptoBotApi(process.env.API_TOKEN || "", endpoint);

async function createCheck(data: CreateCheckOptions) {
  await client.createCheck(data);

  revalidatePath("/");
}

export { createCheck };
