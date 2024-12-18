"use client";

import { TicketType } from "@/lib/dataTypes";
import { insertRedCard } from "@/lib/supabaseAction";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateCheck() {
  const queryClient = useQueryClient();
  const { mutate: createCheck, isPending: isCreating } = useMutation({
    mutationFn: async ({
      data,
      image,
    }: {
      data: TicketType;
      image: FormData;
    }) => {
      await insertRedCard(data, image);

      await queryClient.invalidateQueries();
    },
  });

  return { createCheck, isCreating };
}
