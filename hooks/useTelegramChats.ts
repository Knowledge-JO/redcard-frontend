import { getTelegramChats } from "@/lib/supabaseAction";
import { useQuery } from "@tanstack/react-query";

export function useTelegramChats() {
  const {
    data: telegramChats,
    error,
    isPending: fetchingChats,
  } = useQuery({
    queryKey: ["telegramChats"],
    queryFn: async () => await getTelegramChats(),
  });

  return { telegramChats, fetchingChats, error };
}
