"use client";

import { getChecks } from "@/lib/action";
import { useQuery } from "@tanstack/react-query";

export function useChecks() {
  const { data: checks } = useQuery({
    queryKey: ["checks"],
    queryFn: async () => await getChecks(),
  });
  return { checks };
}
