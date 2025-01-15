import { usePublicContext } from "@/context/PublicProvider";
import { getTelegramChats } from "@/lib/supabaseAction";
import { useQuery } from "@tanstack/react-query";

export function useTelegramChats() {
  const { userId, username } = usePublicContext();
  const id = userId || 0;
  const user_name = username || "";
  const {
    data: telegramChats,
    error,
    isPending: fetchingChats,
  } = useQuery({
    queryKey: ["telegramChats", id, user_name],
    queryFn: async () => await getTelegramChats(id, user_name),
  });

  return { telegramChats, fetchingChats, error };
}
