"use client";

import { getRedCards } from "@/lib/supabaseAction";
import { useQuery } from "@tanstack/react-query";

export function useRedPackets() {
  const { data: redpackets } = useQuery({
    queryKey: ["redpackets"],
    queryFn: async () => await getRedCards(),
  });
  return { redpackets };
}
