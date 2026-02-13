import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { notificationAPI } from "../api";
import { Notification, NotificationType } from "../types";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { useAuthStore } from "@/features/auth/store";
import { colors } from "@/shared/ui/CommonStyles";

interface NotificationDropdownProps {
  onClose: () => void;
}

type TabType = "ALL" | "ORDER" | "CHAT";

const Container = styled.div`
  position: absolute;
  right: 0;
  top: 3rem;
  width: 24rem;
  background: ${colors.white};
  border-radius: 0.5rem;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid ${colors.border};
  z-index: 50;

  @media (max-width: 640px) {
    width: calc(100vw - 2rem);
  }
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${colors.border};
`;

const Tab = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s;
  color: ${({ active }) => (active ? colors.primary : colors.textSecondary)};
  border-bottom: 2px solid
    ${({ active }) => (active ? colors.primary : "transparent")};
  margin-bottom: -1px;

  &:hover {
    color: ${colors.primary};
  }
`;

const NotificationList = styled.div`
  max-height: 24rem;
  overflow-y: auto;
`;

const EmptyState = styled.div`
  padding: 2rem;
  text-align: center;
  color: ${colors.textSecondary};
`;

const NotificationItem = styled.div<{ isRead: boolean }>`
  padding: 1rem;
  border-bottom: 1px solid ${colors.border};
  cursor: pointer;
  transition: background-color 0.2s;
  background: ${({ isRead }) => (isRead ? colors.white : colors.infoLight)};

  &:hover {
    background: ${colors.background};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const NotificationContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
`;

const NotificationIcon = styled.span`
  font-size: 1.5rem;
`;

const NotificationMain = styled.div`
  flex: 1;
  min-width: 0;
`;

const NotificationTitle = styled.p`
  font-weight: 500;
  font-size: 0.875rem;
  color: ${colors.text};
`;

const NotificationText = styled.p`
  font-size: 0.875rem;
  color: ${colors.textSecondary};
  margin-top: 0.25rem;
`;

const NotificationTime = styled.p`
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 0.5rem;
`;

const LoadingText = styled.div`
  padding: 1rem;
  text-align: center;
  color: ${colors.textSecondary};
`;

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
    if (!notification.isRead) {
      try {
        await notificationAPI.markAsRead(notification.id);
      } catch (error) {
        console.error("Failed to mark as read:", error);
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
      <TabContainer>
        <Tab active={activeTab === "ALL"} onClick={() => setActiveTab("ALL")}>
          전체
        </Tab>
        <Tab
          active={activeTab === "ORDER"}
          onClick={() => setActiveTab("ORDER")}
        >
          주문
        </Tab>
        <Tab active={activeTab === "CHAT"} onClick={() => setActiveTab("CHAT")}>
          채팅
        </Tab>
      </TabContainer>

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
                    {formatDistanceToNow(new Date(notification.createdAt), {
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
