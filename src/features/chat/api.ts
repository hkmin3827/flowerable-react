import { axiosInstance } from "@/shared/api/axios";
import {
  ChatMessage,
  ChatMessageSendReq,
  ChatRoomListRes,
  ChatRoomRes,
} from "./types";

export const chatAPI = {
  getChatRooms: () => {
    return axiosInstance.get<ChatRoomListRes[]>("/chats/rooms");
  },
  getChatMessages: (chatRoomId: number) =>
    axiosInstance.get<ChatMessage[]>(`/chats/${chatRoomId}/messages`),

  enterChatRoom: (targetId: number) =>
    axiosInstance.post<ChatRoomRes>(`/chats/chat-room/${targetId}`),

  sendMessage: (message: ChatMessageSendReq) =>
    axiosInstance.post("/chats/message", message),
};
