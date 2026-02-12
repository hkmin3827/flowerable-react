import React, { useState, useEffect, useRef } from "react";
import { X, Send } from "lucide-react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { chatAPI } from "../api";
import { ChatRoom, ChatMessage } from "../types";
import { format } from "date-fns";
import { Role } from "@/shared/types";

interface ChatRoomModalProps {
  chatRoom: ChatRoom;
  userType: Role;
  onClose: () => void;
}

const ChatRoomModal: React.FC<ChatRoomModalProps> = ({
  chatRoom,
  userType,
  onClose,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const targetId = userType === "ROLE_USER" ? chatRoom.shopId : chatRoom.userId;

  useEffect(() => {
    // 기존 메시지 로드
    fetchMessages();

    // 채팅방 입장 처리 (읽음 처리)
    chatAPI.enterChatRoom(chatRoom.id);

    // WebSocket 연결

    const socket = new WebSocket("ws://localhost:8080/ws/chat");
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log("Connected to WebSocket");

        // 채팅방 구독
        client.subscribe(`/sub/chat/room/${chatRoom.id}`, (message) => {
          const receivedMessage = JSON.parse(message.body);
          setMessages((prev) => [...prev, receivedMessage]);
        });
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame);
      },
    });

    client.activate();
    setStompClient(client);

    return () => {
      if (client) {
        client.deactivate();
      }
    };
  }, [chatRoom.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await chatAPI.getChatMessages(chatRoom.id);
      setMessages(response.data);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !stompClient) return;

    const messageData = {
      targetId,
      content: newMessage,
    };

    stompClient.publish({
      destination: "/pub/chat/message",
      body: JSON.stringify(messageData),
    });

    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const isMyMessage = (message: ChatMessage) => {
    return message.senderType === userType;
  };

  return (
    <>
      {/* 배경 오버레이 */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />

      {/* 채팅 모달 */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-lg shadow-2xl z-50 flex flex-col h-[600px]">
        {/* 헤더 */}
        <div className="p-4 border-b flex justify-between items-center bg-pink-600 text-white rounded-t-lg">
          <h3 className="font-bold">
            {userType === "ROLE_USER" ? chatRoom.shopName : chatRoom.userName}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-pink-700 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* 메시지 목록 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${isMyMessage(message) ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  isMyMessage(message)
                    ? "bg-pink-600 text-white"
                    : "bg-white text-gray-900"
                }`}
              >
                <p className="text-sm break-words">{message.content}</p>
                <span
                  className={`text-xs ${
                    isMyMessage(message) ? "text-pink-200" : "text-gray-500"
                  } mt-1 block`}
                >
                  {format(new Date(message.sentAt), "HH:mm")}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* 입력 영역 */}
        <div className="p-4 border-t bg-white rounded-b-lg">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="메시지를 입력하세요..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <button
              onClick={handleSendMessage}
              className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 flex items-center gap-2"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatRoomModal;
