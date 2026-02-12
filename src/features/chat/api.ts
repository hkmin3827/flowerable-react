import { axiosInstance } from "@/shared/api/axios";
import { PageResponse } from "@/shared/types";
import { ChatMessage, ChatMessageSendReq, ChatRoom } from "./types";

export const chatAPI = {
  getChatRooms: (page: number = 0, size: number = 20) =>
    axiosInstance.get<PageResponse<ChatRoom>>("/chats/rooms", {
      params: { page, size },
    }),

  getChatMessages: (chatRoomId: number) =>
    axiosInstance.get<ChatMessage[]>(`/chats/rooms/${chatRoomId}/messages`),

  getOrCreateChatRoom: (targetId: number) =>
    axiosInstance.post<number>("/chats/rooms", null, { params: { targetId } }),

  enterChatRoom: (chatRoomId: number) =>
    axiosInstance.patch(`/chats/${chatRoomId}/enter`),

  sendMessage: (message: ChatMessageSendReq) =>
    axiosInstance.post("/chats/message", message),
};
