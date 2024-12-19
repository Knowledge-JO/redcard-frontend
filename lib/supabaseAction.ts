"use server";

import { ITicket, TicketType, UnclaimedCheckType } from "./dataTypes";
import supabase, { supabaseUrl } from "./supabase";
import { distributePrizeUnevenly } from "./utils";

import bycrypt from "bcryptjs";

async function getRedCards(): Promise<ITicket[]> {
  const { data: redcards, error } = await supabase.from("redcards").select("*");

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

export { insertRedCard, getRedCards };
