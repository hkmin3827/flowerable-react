export interface ChatRoom {
  id: number;
  userId: number;
  shopId: number;
  userName: string;
  shopName: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface ChatMessage {
  id: number;
  chatRoomId: number;
  senderType: "ROLE_USER" | "ROLE_SHOP";
  senderId: number;
  content: string;
  isRead: boolean;
  sentAt: string;
}

export interface ChatMessageSendReq {
  targetId: number;
  content: string;
}
