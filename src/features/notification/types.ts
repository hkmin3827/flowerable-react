export enum NotificationType {
  MESSAGE_RECEIVED = "MESSAGE_RECEIVED",
  ORDER_CREATED = "ORDER_CREATED",
  ORDER_ACCEPTED = "ORDER_ACCEPTED",
  ORDER_READY = "ORDER_READY",
  ORDER_CANCELED = "ORDER_CANCELED",
}

export interface Notification {
  id: number;
  receiverId: number;
  receiverType: "USER" | "SHOP";
  title: string;
  content: string;
  type: NotificationType;
  referenceId: number;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}
