"use server";

import { ITicket, TicketType, UnclaimedCheckType } from "./dataTypes";
import supabase, { supabaseUrl } from "./supabase";
import { distributePrizeUnevenly } from "./utils";

import bycrypt from "bcryptjs";

async function getRedCards(): Promise<ITicket[]> {
  const { data: redcards, error } = await supabase
    .from("redcards")
    .select("*")
    .order("id", { ascending: false });

  if (error) throw new Error(error.message);
  return redcards;
}

async function insertRedCard(
  data: TicketType,
  imageData: FormData
): Promise<ITicket> {
  const unclaimed_packets: UnclaimedCheckType[] = [];

  const image = imageData.get("image") as Blob;

  const salt = bycrypt.genSaltSync();
  const hash =
    data.mode == "password" ? bycrypt.hashSync(data.password!, salt) : "";

  const totalAmount =
    data.type == "lucky"
      ? distributePrizeUnevenly(data.noOfTickets, Number(data.amount))
      : [];

  for (let i = 0; i < data.noOfTickets; i++) {
    const amount =
      data.type == "lucky" ? totalAmount[i].toFixed(2) : data.amount;

    unclaimed_packets.push({ amount });
  }

  const isUpload = !data.cover?.startsWith(supabaseUrl);

  const imageName = `${Math.random()}-cover`;
  const imagePath = `${supabaseUrl}/storage/v1/object/public/personalCovers/${imageName}`;

  if (!data.cover?.startsWith(supabaseUrl) && data.cover) {
    const { error: uploadError } = await supabase.storage
      .from("personalCovers")
      .upload(imageName, image, {
        contentType: image.type,
      });

    if (uploadError) throw new Error(uploadError.message);
  }

  const { data: card, error } = await supabase
    .from("redcards")
    .insert([
      {
        ...data,
        unclaimed_checks: unclaimed_packets,
        cover: isUpload ? (data.cover ? imagePath : "") : data.cover,
        password: hash,
      },
    ])
    .select()
    .single();

  if (error) throw new Error(error.message);

  return card;
}

async function getTelegramChats(
  userId: number
): Promise<{ chatId: number; chatName: string }[]> {
  const { data: telegram, error } = await supabase
    .from("telegram")
    .select("chatId,chatName")
    .eq("creatorId", userId);
  if (error) {
    throw new Error(error.message);
  }

  return telegram;
}

async function getTelegramDataByChatId(chatId: number) {
  const { data: telegram, error } = await supabase
    .from("telegram")
    .select("*")
    .eq("chatId", chatId);

  if (error) {
    throw new Error(error.message);
  }

  return telegram;
}

async function updateWelcomeMessage(...args: string[]) {
  const chatId = args[0];
  const message = args[1];
  console.log({ chatId, message });
  const { error } = await supabase
    .from("telegram")
    .update({ message })
    .eq("chatId", chatId)
    .select();

  if (error) {
    throw new Error(error.message);
  }
}

async function updateWelcomeImage(
  chatId: number,
  formData: FormData,
  fileName: string
) {
  const imageFile = formData.get("image") as File;
  const { error } = await supabase.storage
    .from("welcome")
    .upload(fileName, imageFile, {
      contentType: imageFile.type,
    });

  if (error) {
    throw new Error(error.message);
  }

  const { error: updateError } = await supabase
    .from("telegram")
    .update({
      imageUrl: `${supabaseUrl}/storage/v1/object/public/welcome/${fileName}`,
    })
    .eq("chatId", chatId)
    .select();

  if (updateError) {
    throw new Error(updateError.message);
  }
}

async function updateKeywordReplies(...args: string[]) {
  const chatId = args[0];
  const keywordReply = JSON.parse(args[1]);
  console.log({ chatId, keywordReply });
  const data = await getTelegramDataByChatId(+chatId);
  const chatData = data ? data : [];
  if (chatData.length > 0) {
    const chat = chatData[0];
    const kwdReplies = chat.keywordReplies ? chat.keywordReplies : [];
    const { error } = await supabase
      .from("telegram")
      .update({ keywordReplies: [...kwdReplies, keywordReply] })
      .eq("chatId", chatId)
      .select();

    if (error) {
      throw new Error(error.message);
    }
  }
}

async function updateInappropiateWords(...args: string[]) {
  const chatId = args[0];
  const wordsStringfied = args[1];
  const words: string[] = wordsStringfied
    .split(",")
    .map((word) => word.trimStart());

  console.log({ chatId, words });

  const data = await getTelegramDataByChatId(+chatId);
  const chatData = data ? data : [];

  if (chatData.length > 0) {
    const chat = chatData[0];
    const inappropriateKeywords = chat.inappropriateKeywords
      ? chat.inappropriateKeywords
      : [];
    const { error } = await supabase
      .from("telegram")
      .update({ inappropriateKeywords: [...inappropriateKeywords, ...words] })
      .eq("chatId", chatId)
      .select();

    if (error) {
      throw new Error(error.message);
    }
  }
}

async function updateAllowedLinks(...args: string[]) {
  const chatId = args[0];
  const linksStrinified = args[1];
  const links: string[] = linksStrinified.split(",").map((link) => link.trim());

  console.log({ chatId, links });

  const data = await getTelegramDataByChatId(+chatId);
  const chatData = data ? data : [];

  if (chatData.length > 0) {
    const chat = chatData[0];
    const allowedLinks = chat.allowedLinks ? chat.allowedLinks : [];
    const { error } = await supabase
      .from("telegram")
      .update({ allowedLinks: [...allowedLinks, ...links] })
      .eq("chatId", chatId)
      .select();

    if (error) {
      throw new Error(error.message);
    }
  }
}

export {
  insertRedCard,
  getRedCards,
  updateWelcomeMessage,
  updateWelcomeImage,
  updateKeywordReplies,
  updateInappropiateWords,
  updateAllowedLinks,
  getTelegramChats,
};
