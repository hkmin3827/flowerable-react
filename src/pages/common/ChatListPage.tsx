import React, { useState, useEffect } from "react";
import { chatAPI } from "@/features/chat/api";
import { ChatRoom } from "@/features/chat/types";
import ChatRoomModal from "@/features/chat/components/ChatRoomModal";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { useAuthStore } from "@/features/auth/store";

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
      {/* 채팅 목록 모달 */}
      <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl z-50 flex flex-col">
        {/* 헤더 */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">채팅</h2>
        </div>

        {/* 채팅방 목록 */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500">로딩 중...</div>
          ) : chatRooms.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              채팅방이 없습니다
            </div>
          ) : (
            chatRooms.map((room) => (
              <div
                key={room.id}
                onClick={() => handleChatRoomClick(room)}
                className="p-4 border-b hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {user?.role === "ROLE_USER"
                        ? room.shopName
                        : room.userName}
                    </h3>
                    <p className="text-sm text-gray-600 truncate mt-1">
                      {room.lastMessage || "메시지가 없습니다"}
                    </p>
                  </div>
                  <div className="ml-3 flex flex-col items-end gap-1">
                    {room.lastMessageAt && (
                      <span className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(room.lastMessageAt), {
                          addSuffix: true,
                          locale: ko,
                        })}
                      </span>
                    )}
                    {room.unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                        {room.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 채팅방 모달 */}
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
