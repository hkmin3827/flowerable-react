import styled from "styled-components";
import { colors } from "@/shared/ui/CommonStyles";
import { MessageSquare, ChevronRight } from "lucide-react";

export const Container = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

export const PageTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: bold;
  color: ${colors.text};
  margin-bottom: 2rem;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 1rem;
`;

export const EmptyIcon = styled(MessageSquare)`
  margin: 0 auto 1rem;
  color: #d1d5db;
`;

export const EmptyText = styled.p`
  color: ${colors.textSecondary};
  font-size: 1rem;
`;

export const ChatList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const ChatCard = styled.div`
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

export const ChatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

export const ChatInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const OpponentName = styled.h3`
  font-size: 1.125rem;
  font-weight: bold;
  color: ${colors.text};
`;

export const UnreadBadge = styled.span`
  display: inline-block;
  padding: 0.375rem 0.875rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  background: ${colors.errorLight};
  color: ${colors.error};
`;

export const ChatFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const MessageInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const LastMessage = styled.p`
  font-size: 1rem;
  font-weight: 500;
  color: ${colors.text};
`;

export const TimeText = styled.p`
  font-size: 0.875rem;
  color: ${colors.textSecondary};
`;

export const ArrowIcon = styled(ChevronRight)`
  color: #9ca3af;
  flex-shrink: 0;
`;
