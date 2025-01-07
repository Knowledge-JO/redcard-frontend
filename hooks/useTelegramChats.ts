import { usePublicContext } from "@/context/PublicProvider";
import { getTelegramChats } from "@/lib/supabaseAction";
import { useQuery } from "@tanstack/react-query";

export function useTelegramChats() {
  const { userId, username } = usePublicContext();
  const id = userId || 0;
  const {
    data: telegramChats,
    error,
    isPending: fetchingChats,
  } = useQuery({
    queryKey: ["telegramChats", id, username],
    queryFn: async () => await getTelegramChats(id, username || ""),
  });

  return { telegramChats, fetchingChats, error };
}
