import styled from 'styled-components';
import { colors } from '@/shared/ui/CommonStyles';

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 60;
  padding: 1rem;
`;

export const ModalContainer = styled.div`
  background: ${colors.white};
  border-radius: 0.75rem;
  width: 100%;
  max-width: 36rem;
  height: 600px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${colors.border};
`;

export const ModalTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${colors.text};
`;

export const CloseButton = styled.button`
  padding: 0.25rem;
  border: none;
  background: transparent;
  cursor: pointer;
  color: ${colors.textSecondary};
  transition: color 0.2s;

  &:hover {
    color: ${colors.text};
  }
`;

export const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background: ${colors.background};
`;

export const MessageGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

export const MessageBubble = styled.div<{ $isMe: boolean }>`
  max-width: 70%;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  word-wrap: break-word;
  align-self: ${({ $isMe }) => ($isMe ? "flex-end" : "flex-start")};
  background: ${({ $isMe }) => ($isMe ? colors.primary : colors.white)};
  color: ${({ $isMe }) => ($isMe ? colors.white : colors.text)};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

export const MessageText = styled.p`
  margin: 0;
  line-height: 1.4;
`;

export const MessageTime = styled.span<{ $isMe: boolean }>`
  display: block;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  opacity: 0.7;
  text-align: ${({ $isMe }) => ($isMe ? "right" : "left")};
`;

export const InputContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid ${colors.border};
  background: ${colors.white};
  border-radius: 0 0 0.75rem 0.75rem;
`;

export const Input = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid ${colors.border};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px ${colors.primaryLight};
  }
`;

export const SendButton = styled.button`
  padding: 0.75rem 1.25rem;
  background: ${colors.primary};
  color: ${colors.white};
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${colors.primaryHover};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: ${colors.textSecondary};
`;
