"use server";

const endpoint = "https://testnet-pay.crypt.bot/api";

import CryptoBotApi, {
  CreateCheckOptions,
  CryptoCurrencyCode,
} from "crypto-bot-api";

const client = new CryptoBotApi(process.env.API_TOKEN || "", endpoint);

async function getChecks() {
  const checks = await client.getChecks();
  return checks;
}

async function createPayCheck(data: CreateCheckOptions) {
  await client.createCheck(data);
}

async function getBal(asset: CryptoCurrencyCode) {
  const balance = await client.getBalance(asset);

  return balance.available;
}

async function deletePayCheck(id: number) {
  await client.deleteCheck(id);
}

export { getChecks, createPayCheck, deletePayCheck, getBal };
