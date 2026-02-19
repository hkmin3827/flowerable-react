import { axiosInstance } from "@/shared/api/axios";
import { UserProfile } from "@/shared/types";

export const userAPI = {
  getUserProfile: (userId: number) =>
    axiosInstance.get<UserProfile>(`/users/${userId}`),
};
