"use client";

import { deletePayCheck } from "@/lib/action";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteCheck() {
  const queryClient = useQueryClient();
  const { mutate: deleteCheck } = useMutation({
    mutationFn: async (id: number) => {
      await deletePayCheck(id);
      await queryClient.invalidateQueries();
    },
  });

  return { deleteCheck };
}
