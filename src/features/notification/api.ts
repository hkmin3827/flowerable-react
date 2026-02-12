import { axiosInstance } from "@/shared/api/axios";
import { PageResponse } from "@/shared/types";
import { NotificationType } from "./types";
export const notificationAPI = {
  getAll: (page: number = 0, size: number = 10) =>
    axiosInstance.get<PageResponse<Notification>>("/notifications/unread", {
      params: { page, size },
    }),

  getByType: (type: NotificationType, page: number = 0, size: number = 10) =>
    axiosInstance.get<PageResponse<Notification>>("/notifications/type", {
      params: { type, page, size },
    }),

  markAsRead: (notificationId: number) =>
    axiosInstance.patch(`/notifications/${notificationId}/read`),
};
