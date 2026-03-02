import React, { useState, useEffect } from "react";
import { chatAPI } from "@/features/chat/api";
import ChatRoomModal from "@/features/chat/components/ChatRoomModal";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { useAuthStore } from "@/features/auth/store";
import { LoadingContainer } from "@/shared/ui/CommonStyles";
import { ChatRoomListRes } from "@/features/chat/types";
import {
  Container,
  PageTitle,
  EmptyState,
  EmptyIcon,
  EmptyText,
  ChatList,
  ChatCard,
  ChatHeader,
  ChatInfo,
  OpponentName,
  UnreadBadge,
  ChatFooter,
  MessageInfo,
  LastMessage,
  TimeText,
  ArrowIcon,
} from "./ChatListPage.styles";

const ChatListPage: React.FC = () => {
  const [chatRooms, setChatRooms] = useState<ChatRoomListRes[]>([]);
  const [selectedChatRoom, setSelectedChatRoom] =
    useState<ChatRoomListRes | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchChatRooms();
  }, []);

  const fetchChatRooms = async () => {
    try {
      const response = await chatAPI.getChatRooms();
      setChatRooms(response.data);
    } catch (error) {
      console.error("Failed to fetch chat rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChatRoomClick = (chatRoom: ChatRoomListRes) => {
    setSelectedChatRoom(chatRoom);
  };

  if (loading) {
    return (
      <Container>
        <LoadingContainer>로딩 중...</LoadingContainer>
      </Container>
    );
  }

  return (
    <>
      <Container>
        <PageTitle>채팅</PageTitle>

        {chatRooms.length === 0 ? (
          <EmptyState>
            <EmptyIcon size={64} />
            <EmptyText>채팅방이 없습니다</EmptyText>
          </EmptyState>
        ) : (
          <ChatList>
            {chatRooms.map((room) => (
              <ChatCard key={room.id} onClick={() => handleChatRoomClick(room)}>
                <ChatHeader>
                  <ChatInfo>
                    <OpponentName>{room.opponentName}</OpponentName>
                  </ChatInfo>

                  {room.unreadCount > 0 && (
                    <UnreadBadge>{room.unreadCount} unread</UnreadBadge>
                  )}
                </ChatHeader>

                <ChatFooter>
                  <MessageInfo>
                    <LastMessage>
                      {room.lastMessage || "메시지가 없습니다"}
                    </LastMessage>

                    {room.lastMessageAt && (
                      <TimeText>
                        {formatDistanceToNow(new Date(room.lastMessageAt), {
                          addSuffix: true,
                          locale: ko,
                        })}
                      </TimeText>
                    )}
                  </MessageInfo>

                  <ArrowIcon size={24} />
                </ChatFooter>
              </ChatCard>
            ))}
          </ChatList>
        )}
      </Container>

      {selectedChatRoom && (
        <ChatRoomModal
          chatRoom={selectedChatRoom}
          userType={user!.role}
          onClose={() => setSelectedChatRoom(null)}
        />
      )}
    </>
  );
};

export default ChatListPage;
