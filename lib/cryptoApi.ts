import CryptoBotApi, { CreateCheckOptions } from "crypto-bot-api";

const endpoint = "https://testnet-pay.crypt.bot/api";

const client = new CryptoBotApi(process.env.API_TOKEN || "", endpoint);

async function getMe() {
  const data = await client.getMe();
  return data;
}

async function getChecks() {
  try {
    const checks = await client.getChecks();
    return checks;
  } catch (error) {
    console.log(error);
  }
}

async function createPayCheck(data: CreateCheckOptions) {
  const check = await client.createCheck(data);
  return check;
}

export { getMe, getChecks, createPayCheck };
