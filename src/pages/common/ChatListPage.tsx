import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { chatAPI } from "@/features/chat/api";
import ChatRoomModal from "@/features/chat/components/ChatRoomModal";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { useAuthStore } from "@/features/auth/store";
import { colors, LoadingContainer } from "@/shared/ui/CommonStyles";
import { MessageSquare, ChevronRight } from "lucide-react";
import { ChatRoomListRes } from "@/features/chat/types";

const Container = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const PageTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: bold;
  color: ${colors.text};
  margin-bottom: 2rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 1rem;
`;

const EmptyIcon = styled(MessageSquare)`
  margin: 0 auto 1rem;
  color: #d1d5db;
`;

const EmptyText = styled.p`
  color: ${colors.textSecondary};
  font-size: 1rem;
`;

const ChatList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ChatCard = styled.div`
  background: ${colors.white};
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const ChatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const ChatInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const OpponentName = styled.h3`
  font-size: 1.125rem;
  font-weight: bold;
  color: ${colors.text};
`;

const UnreadBadge = styled.span`
  display: inline-block;
  padding: 0.375rem 0.875rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  background: ${colors.errorLight};
  color: ${colors.error};
`;

const ChatFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MessageInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const LastMessage = styled.p`
  font-size: 1rem;
  font-weight: 500;
  color: ${colors.text};
`;

const TimeText = styled.p`
  font-size: 0.875rem;
  color: ${colors.textSecondary};
`;

const ArrowIcon = styled(ChevronRight)`
  color: #9ca3af;
  flex-shrink: 0;
`;

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
