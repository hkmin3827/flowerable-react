import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { notificationAPI } from "../api";
import { Notification, NotificationType } from "../types";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { useAuthStore } from "@/features/auth/store";

interface NotificationDropdownProps {
  onClose: () => void;
}

type TabType = "ALL" | "ORDER" | "CHAT";

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  onClose,
}) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>("ALL");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setNotifications([]);
    setPage(0);
    setHasMore(true);
    fetchNotifications(0);
  }, [activeTab]);

  const fetchNotifications = async (pageNum: number) => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      let response;

      if (activeTab === "ALL") {
        response = await notificationAPI.getAll(pageNum, 10);
      } else if (activeTab === "ORDER") {
        response = await notificationAPI.getByType(
          NotificationType.ORDER_CREATED,
          pageNum,
          10,
        );
      } else {
        response = await notificationAPI.getByType(
          NotificationType.MESSAGE_RECEIVED,
          pageNum,
          10,
        );
      }

      const newNotifications = response.data.content;
      setNotifications((prev) => [...prev, ...newNotifications]);
      setHasMore(!response.data.last);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = () => {
    if (!listRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = listRef.current;

    if (scrollHeight - scrollTop <= clientHeight * 1.5 && hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNotifications(nextPage);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    // 읽음 처리
    if (!notification.isRead) {
      try {
        await notificationAPI.markAsRead(notification.id);
      } catch (error) {
        console.error("Failed to mark as read:", error);
      }
    }

    // 알림 타입에 따라 이동
    if (notification.type === NotificationType.MESSAGE_RECEIVED) {
      navigate("/chats");
    } else {
      if (user?.role === "ROLE_USER") {
        navigate(`/orders/${notification.referenceId}`);
      } else {
        navigate(`/shop/orders/${notification.referenceId}`);
      }
    }

    onClose();
  };

  const getNotificationIcon = (type: NotificationType) => {
    if (type === NotificationType.MESSAGE_RECEIVED) {
      return "💬";
    }
    return "📦";
  };

  return (
    <div
      className="absolute right-0 top-12 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50"
      style={{ position: "absolute" }}
    >
      {/* 탭 */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab("ALL")}
          className={`flex-1 py-3 text-sm font-medium ${
            activeTab === "ALL"
              ? "text-pink-600 border-b-2 border-pink-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          전체
        </button>
        <button
          onClick={() => setActiveTab("ORDER")}
          className={`flex-1 py-3 text-sm font-medium ${
            activeTab === "ORDER"
              ? "text-pink-600 border-b-2 border-pink-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          주문
        </button>
        <button
          onClick={() => setActiveTab("CHAT")}
          className={`flex-1 py-3 text-sm font-medium ${
            activeTab === "CHAT"
              ? "text-pink-600 border-b-2 border-pink-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          채팅
        </button>
      </div>

      {/* 알림 목록 */}
      <div
        ref={listRef}
        onScroll={handleScroll}
        className="max-h-96 overflow-y-auto"
      >
        {notifications.length === 0 && !loading ? (
          <div className="p-8 text-center text-gray-500">알림이 없습니다</div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                !notification.isRead ? "bg-blue-50" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">
                  {getNotificationIcon(notification.type)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900">
                    {notification.title}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {notification.content}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                      locale: ko,
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}

        {loading && (
          <div className="p-4 text-center text-gray-500">로딩 중...</div>
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
