import { axiosInstance } from "@/shared/api/axios";
import { PageResponse } from "@/shared/types";
import { AppNotification } from "./types";

export const notificationAPI = {
  getAll: (page: number = 0, size: number = 10) =>
    axiosInstance.get<PageResponse<AppNotification>>("/notifications/unread", {
      params: { page, size },
    }),

  markAsRead: (notificationId: number) =>
    axiosInstance.patch(`/notifications/${notificationId}/read`),

  getUnreadCount: () => axiosInstance.get("/notifications/unread-count"),
};
