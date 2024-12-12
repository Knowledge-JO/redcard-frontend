"use client";

import { createPayCheck } from "@/lib/action";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateCheckOptions } from "crypto-bot-api";

export function useCreateCheck(tickets: number) {
  const queryClient = useQueryClient();
  const { mutate: createCheck } = useMutation({
    mutationFn: async (data: CreateCheckOptions) => {
      for (let i = 1; i <= tickets; i++) {
        await createPayCheck(data);
      }
      queryClient.invalidateQueries();
    },
  });

  return { createCheck };
}
