import { claimPacket } from "@/lib/action";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useClaimPacket() {
  const queryClient = useQueryClient();
  const { mutate: claimRedPacket, isPending } = useMutation({
    mutationFn: async ({
      id,
      userId,
      username,
      password,
    }: {
      id: number;
      userId: number;
      username: string;
      password?: string;
    }) => {
      await claimPacket({ id, userId, username, password });
      await queryClient.invalidateQueries();
    },
  });

  return { claimRedPacket, isPending };
}
