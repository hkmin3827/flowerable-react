import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/shared/api/axios";

export const useUnreadNotificationCount = (enabled: boolean) => {
  return useQuery({
    queryKey: ["notification", "unread-count"],
    queryFn: async () => {
      const res = await axiosInstance.get<number>(
        "/notifications/unread-count",
      );
      return res.data;
    },
    enabled,
    refetchInterval: 10000, // 10초마다 자동 갱신
  });
};
