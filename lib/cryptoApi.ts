const endpoint = "https://testnet-pay.crypt.bot/api";

import CryptoBotApi from "crypto-bot-api";

const client = new CryptoBotApi(process.env.API_TOKEN || "", endpoint);

async function getMe() {
  const data = await client.getMe();
  return data;
}

async function getChecks() {
  const checks = await client.getChecks();
  return checks;
}

export { getMe, getChecks };
