"use client";

import { TicketType } from "@/lib/dataTypes";
import { insertRedCard } from "@/lib/supabaseAction";
import { useMutation } from "@tanstack/react-query";

export function useCreateCheck() {
  const {
    mutate: createCheck,
    isPending: isCreating,
    isSuccess,
  } = useMutation({
    mutationFn: async ({
      data,
      image,
    }: {
      data: TicketType;
      image: FormData;
    }) => {
      return await insertRedCard(data, image);
    },
  });

  return { createCheck, isCreating, isSuccess };
}
