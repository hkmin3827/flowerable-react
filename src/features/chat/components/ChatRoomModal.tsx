import React, { useState, useEffect, useRef } from "react";
import { chatAPI } from "../api";
import { ChatMessage, ChatRoomListRes } from "../types";
import { X, Send } from "lucide-react";
import { format } from "date-fns";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useAuthStore } from "@/features/auth/store";
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  CloseButton,
  MessagesContainer,
  MessageGroup,
  MessageBubble,
  MessageText,
  MessageTime,
  InputContainer,
  Input,
  SendButton,
  EmptyState,
} from "./ChatRoomModal.styles";

interface ChatRoomModalProps {
  chatRoom: ChatRoomListRes;
  userType: string;
  onClose: () => void;
}

const ChatRoomModal: React.FC<ChatRoomModalProps> = ({
  chatRoom,
  userType,
  onClose,
}) => {
  const { accessToken } = useAuthStore();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  // const [sending, setSending] = useState(false);
  const stompClient = useRef<Client | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadMessagesAndEnter = async () => {
      try {
        const targetId =
          userType === "ROLE_USER" ? chatRoom.shopId : chatRoom.userId;

        const res = await chatAPI.getChatMessages(chatRoom.id);
        setMessages(res.data);

        await chatAPI.enterChatRoom(targetId);
      } catch (error) {
        console.error("메시지 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMessagesAndEnter();
  }, [chatRoom.id, userType]);

  useEffect(() => {
    const socket = new SockJS("https://flowerable.duckdns.org/ws/chat");
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      debug: () => {},
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      console.log("WS Connected");

      client.subscribe(`/sub/chat/room/${chatRoom.id}`, (message) => {
        const received: ChatMessage = JSON.parse(message.body);
        setMessages((prev) => [...prev, received]);
      });
    };

    client.activate();
    stompClient.current = client;

    return () => {
      client.deactivate();
    };
  }, [chatRoom.id, accessToken]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !stompClient.current?.connected) return;

    stompClient.current.publish({
      destination: "/pub/chat/message",
      body: JSON.stringify({
        chatRoomId: chatRoom.id,
        content: newMessage.trim(),
      }),
    });

    setNewMessage("");
  };

  const isMyMessage = (message: ChatMessage): boolean => {
    if (userType === "ROLE_USER") {
      return message.senderType === "USER";
    }
    return message.senderType === "SHOP";
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{chatRoom.opponentName} 님과의 채팅</ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={24} />
          </CloseButton>
        </ModalHeader>

        <MessagesContainer>
          {loading ? (
            <EmptyState>로딩 중...</EmptyState>
          ) : messages.length === 0 ? (
            <EmptyState>메시지가 없습니다</EmptyState>
          ) : (
            <MessageGroup>
              {messages.map((message) => {
                const isMe = isMyMessage(message);
                return (
                  <MessageBubble key={message.id} $isMe={isMe}>
                    <MessageText>{message.content}</MessageText>
                    <MessageTime $isMe={isMe}>
                      {format(new Date(message.sentAt), "MM/dd HH:mm")}
                    </MessageTime>
                  </MessageBubble>
                );
              })}
              <div ref={messagesEndRef} />
            </MessageGroup>
          )}
        </MessagesContainer>

        <form onSubmit={handleSendMessage}>
          <InputContainer>
            <Input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="메시지를 입력하세요..."
            />
            <SendButton type="submit" disabled={!newMessage.trim()}>
              <Send size={18} />
              전송
            </SendButton>
          </InputContainer>
        </form>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ChatRoomModal;
