import { usePublicContext } from "@/context/PublicProvider";
import { getTelegramChats } from "@/lib/supabaseAction";
import { useQuery } from "@tanstack/react-query";

export function useTelegramChats() {
  const { userId } = usePublicContext();
  const id = userId || 0;
  const {
    data: telegramChats,
    error,
    isPending: fetchingChats,
  } = useQuery({
    queryKey: ["telegramChats", id],
    queryFn: async () => await getTelegramChats(id),
  });

  return { telegramChats, fetchingChats, error };
}
