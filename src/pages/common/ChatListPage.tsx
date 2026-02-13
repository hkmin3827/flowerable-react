import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { chatAPI } from "@/features/chat/api";
import { ChatRoom } from "@/features/chat/types";
import ChatRoomModal from "@/features/chat/components/ChatRoomModal";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { useAuthStore } from "@/features/auth/store";
import { colors } from "@/shared/ui/CommonStyles";

const Container = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  width: 24rem;
  background: ${colors.white};
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.15);
  z-index: 50;
  display: flex;
  flex-direction: column;

  @media (max-width: 640px) {
    width: 100%;
  }
`;

const Header = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  color: ${colors.text};
`;

const ChatList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const LoadingText = styled.div`
  padding: 2rem;
  text-align: center;
  color: ${colors.textSecondary};
`;

const EmptyText = styled.div`
  padding: 2rem;
  text-align: center;
  color: ${colors.textSecondary};
`;

const ChatRoomItem = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${colors.border};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: ${colors.background};
  }
`;

const ChatRoomContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const ChatRoomMain = styled.div`
  flex: 1;
  min-width: 0;
`;

const ChatRoomName = styled.h3`
  font-weight: 500;
  color: ${colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LastMessage = styled.p`
  font-size: 0.875rem;
  color: ${colors.textSecondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 0.25rem;
`;

const ChatRoomSide = styled.div`
  margin-left: 0.75rem;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
`;

const TimeText = styled.span`
  font-size: 0.75rem;
  color: #9ca3af;
`;

const UnreadBadge = styled.span`
  background: ${colors.error};
  color: ${colors.white};
  font-size: 0.75rem;
  border-radius: 9999px;
  padding: 0.125rem 0.5rem;
  min-width: 1.5rem;
  text-align: center;
`;

const ChatListPage = () => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedChatRoom, setSelectedChatRoom] = useState<ChatRoom | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchChatRooms();
  }, []);

  const fetchChatRooms = async () => {
    try {
      const response = await chatAPI.getChatRooms(0, 50);
      setChatRooms(response.data.content);
    } catch (error) {
      console.error("Failed to fetch chat rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChatRoomClick = (chatRoom: ChatRoom) => {
    setSelectedChatRoom(chatRoom);
  };

  return (
    <>
      <Container>
        <Header>
          <Title>채팅</Title>
        </Header>

        <ChatList>
          {loading ? (
            <LoadingText>로딩 중...</LoadingText>
          ) : chatRooms.length === 0 ? (
            <EmptyText>채팅방이 없습니다</EmptyText>
          ) : (
            chatRooms.map((room) => (
              <ChatRoomItem
                key={room.id}
                onClick={() => handleChatRoomClick(room)}
              >
                <ChatRoomContent>
                  <ChatRoomMain>
                    <ChatRoomName>
                      {user?.role === "ROLE_USER"
                        ? room.shopName
                        : room.userName}
                    </ChatRoomName>
                    <LastMessage>
                      {room.lastMessage || "메시지가 없습니다"}
                    </LastMessage>
                  </ChatRoomMain>
                  <ChatRoomSide>
                    {room.lastMessageAt && (
                      <TimeText>
                        {formatDistanceToNow(new Date(room.lastMessageAt), {
                          addSuffix: true,
                          locale: ko,
                        })}
                      </TimeText>
                    )}
                    {room.unreadCount > 0 && (
                      <UnreadBadge>{room.unreadCount}</UnreadBadge>
                    )}
                  </ChatRoomSide>
                </ChatRoomContent>
              </ChatRoomItem>
            ))
          )}
        </ChatList>
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
