"use client";

import { deletePayCheck } from "@/lib/action";
import { useMutation } from "@tanstack/react-query";

export function useDeleteCheck() {
  const { mutate: deleteCheck } = useMutation({
    mutationFn: async (id: number) => await deletePayCheck(id),
  });

  return { deleteCheck };
}
