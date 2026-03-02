import styled from 'styled-components';
import { colors } from '@/shared/ui/CommonStyles';

export const Container = styled.div`
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

export const NotificationList = styled.div`
  max-height: 24rem;
  overflow-y: auto;
`;

export const EmptyState = styled.div`
  padding: 2rem;
  text-align: center;
  color: ${colors.textSecondary};
`;

export const NotificationItem = styled.div<{ isRead: boolean }>`
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

export const NotificationContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
`;

export const NotificationIcon = styled.span`
  font-size: 1.5rem;
`;

export const NotificationMain = styled.div`
  flex: 1;
  min-width: 0;
`;

export const NotificationTitle = styled.p`
  font-weight: 500;
  font-size: 0.875rem;
  color: ${colors.text};
`;

export const NotificationText = styled.p`
  font-size: 0.875rem;
  color: ${colors.textSecondary};
  margin-top: 0.25rem;
`;

export const NotificationTime = styled.p`
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 0.5rem;
`;

export const LoadingText = styled.div`
  padding: 1rem;
  text-align: center;
  color: ${colors.textSecondary};
`;
