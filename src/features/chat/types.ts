export interface ChatRoomListRes {
  id: number;
  userId: number;
  shopId: number;
  opponentName: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface ChatRoomRes {
  id: number;
  userId: number;
  shopId: number;
  userName: string;
  shopName: string;
}

export interface ChatMessage {
  id: number;
  senderType: "USER" | "SHOP";
  senderId: number;
  content: string;
  isRead: boolean;
  sentAt: string;
}

export interface ChatMessageSendReq {
  chatRoomId: number;
  content: string;
}
