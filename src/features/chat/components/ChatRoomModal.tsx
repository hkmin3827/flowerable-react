import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { chatAPI } from "../api";
import { ChatMessage, ChatRoomListRes } from "../types";
import { colors } from "@/shared/ui/CommonStyles";
import { X, Send } from "lucide-react";
import { format } from "date-fns";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useAuthStore } from "@/features/auth/store";

interface ChatRoomModalProps {
  chatRoom: ChatRoomListRes;
  userType: string;
  onClose: () => void;
}

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 60;
  padding: 1rem;
`;

const ModalContainer = styled.div`
  background: ${colors.white};
  border-radius: 0.75rem;
  width: 100%;
  max-width: 36rem;
  height: 600px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${colors.border};
`;

const ModalTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${colors.text};
`;

const CloseButton = styled.button`
  padding: 0.25rem;
  border: none;
  background: transparent;
  cursor: pointer;
  color: ${colors.textSecondary};
  transition: color 0.2s;

  &:hover {
    color: ${colors.text};
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background: ${colors.background};
`;

const MessageGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const MessageBubble = styled.div<{ $isMe: boolean }>`
  max-width: 70%;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  word-wrap: break-word;
  align-self: ${({ $isMe }) => ($isMe ? "flex-end" : "flex-start")};
  background: ${({ $isMe }) => ($isMe ? colors.primary : colors.white)};
  color: ${({ $isMe }) => ($isMe ? colors.white : colors.text)};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const MessageText = styled.p`
  margin: 0;
  line-height: 1.4;
`;

const MessageTime = styled.span<{ $isMe: boolean }>`
  display: block;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  opacity: 0.7;
  text-align: ${({ $isMe }) => ($isMe ? "right" : "left")};
`;

const InputContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid ${colors.border};
  background: ${colors.white};
  border-radius: 0 0 0.75rem 0.75rem;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid ${colors.border};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px ${colors.primaryLight};
  }
`;

const SendButton = styled.button`
  padding: 0.75rem 1.25rem;
  background: ${colors.primary};
  color: ${colors.white};
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${colors.primaryHover};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: ${colors.textSecondary};
`;

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
    const socket = new SockJS("http://localhost:8080/ws/chat");
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
