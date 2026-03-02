import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { notificationAPI } from "../api";
import { AppNotification, NotificationType } from "../types";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { useAuthStore } from "@/features/auth/store";
import { extractErrorMessage } from "@/shared/utils/errorHandler";
import {
  Container,
  NotificationList,
  EmptyState,
  NotificationItem,
  NotificationContent,
  NotificationIcon,
  NotificationMain,
  NotificationTitle,
  NotificationText,
  NotificationTime,
  LoadingText,
} from "./NotificationDropdown.styles";

interface NotificationDropdownProps {
  onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  onClose,
}) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setNotifications([]);
    setPage(0);
    setHasMore(true);
    fetchNotifications(0);
  }, []);

  const fetchNotifications = async (pageNum: number) => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await notificationAPI.getAll(pageNum, 10);

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

  const handleNotificationClick = async (notification: AppNotification) => {
    if (!notification.isRead) {
      try {
        await notificationAPI.markAsRead(notification.id);
      } catch (error) {
        console.error("Failed to mark as read:", error);
        alert(extractErrorMessage(error));
      }
    }

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
    <Container>
      <NotificationList ref={listRef} onScroll={handleScroll}>
        {notifications.length === 0 && !loading ? (
          <EmptyState>알림이 없습니다</EmptyState>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              isRead={notification.isRead}
              onClick={() => handleNotificationClick(notification)}
            >
              <NotificationContent>
                <NotificationIcon>
                  {getNotificationIcon(notification.type)}
                </NotificationIcon>
                <NotificationMain>
                  <NotificationTitle>{notification.title}</NotificationTitle>
                  <NotificationText>{notification.content}</NotificationText>
                  <NotificationTime>
                    {formatDistanceToNow(new Date(notification.updatedAt), {
                      addSuffix: true,
                      locale: ko,
                    })}
                  </NotificationTime>
                </NotificationMain>
              </NotificationContent>
            </NotificationItem>
          ))
        )}

        {loading && <LoadingText>로딩 중...</LoadingText>}
      </NotificationList>
    </Container>
  );
};

export default NotificationDropdown;
