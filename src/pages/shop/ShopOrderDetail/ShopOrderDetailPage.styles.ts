import styled from "styled-components";
import { colors } from "@/shared/ui/CommonStyles";
import { AccountStatus, OrderStatus } from "@/shared/types";

export const Container = styled.div`
  max-width: 64rem;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

export const BackButton = styled.button`
  padding: 0.5rem;
  border: none;
  background: transparent;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: ${colors.background};
  }
`;

export const PageTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: bold;
  color: ${colors.text};
`;

export const Card = styled.div`
  background: ${colors.white};
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

export const OrderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const OrderNumber = styled.p`
  font-size: 0.875rem;
  color: ${colors.textSecondary};
`;

export const OrderDate = styled.p`
  font-size: 0.875rem;
  color: ${colors.textSecondary};
`;

export const StatusBadge = styled.span<{ status: OrderStatus }>`
  display: inline-block;
  padding: 0.375rem 0.875rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;

  ${({ status }) => {
    switch (status) {
      case "REQUESTED":
        return `background: ${colors.errorLight}; color: ${colors.error};`;
      case "ACCEPTED":
        return `background: ${colors.infoLight}; color: ${colors.info};`;
      case "READY":
        return `background: ${colors.successLight}; color: ${colors.success};`;
      case "COMPLETED":
        return `background: #F3F4F6; color: #6B7280;`;
      case "CANCELED":
        return `background: #F3F4F6; color: #9CA3AF;`;
      default:
        return `background: #F3F4F6; color: #6B7280;`;
    }
  }}
`;

export const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  color: ${colors.text};
  margin-bottom: 1rem;
`;

export const InfoGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const InfoItem = styled.div`
  display: flex;
  align-items: center;

  gap: 0.5rem;
  color: ${colors.textSecondary};
`;

export const InfoLabel = styled.span`
  font-weight: 500;
  color: ${colors.text};
`;

export const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${colors.border};

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

export const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const ItemName = styled.p`
  font-weight: 500;
  color: ${colors.text};
`;

export const ItemQuantity = styled.p`
  font-size: 0.875rem;
  color: ${colors.textSecondary};
`;

export const ItemPrice = styled.p`
  font-weight: bold;
  color: ${colors.text};
`;

export const PriceGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const PriceLabel = styled.span`
  color: ${colors.textSecondary};
`;

export const TotalRow = styled(PriceRow)`
  border-top: 1px solid ${colors.border};
  padding-top: 0.75rem;
  margin-top: 0.5rem;
`;

export const TotalLabel = styled.span`
  font-size: 1.125rem;
  font-weight: bold;
  color: ${colors.text};
`;

export const TotalPrice = styled.span`
  font-size: 1.125rem;
  font-weight: bold;
  color: ${colors.primary};
`;

export const Message = styled.p`
  color: ${colors.textSecondary};
  line-height: 1.6;
`;

export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const Button = styled.button<{
  variant?: "primary" | "success" | "error" | "info";
}>`
  width: 100%;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;

  ${({ variant = "primary" }) => {
    switch (variant) {
      case "success":
        return `
          background: ${colors.success};
          color: ${colors.white};
          &:hover:not(:disabled) {
            background: #059669;
          }
        `;
      case "info":
        return `
          background: ${colors.info};
          color: ${colors.white};
          &:hover:not(:disabled) {
            background: #2563EB;
          }
        `;
      case "error":
        return `
          background: ${colors.error};
          color: ${colors.white};
          &:hover:not(:disabled) {
            background: #DC2626;
          }
        `;
      default:
        return `
          background: ${colors.primary};
          color: ${colors.white};
          &:hover:not(:disabled) {
            background: ${colors.primaryHover};
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

export const ModalTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: bold;
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

export const ProfileButton = styled.button`
  padding: 5px 5px;
  border-radius: 999px;
  border: none;
  color: ${colors.textSecondary};
  width: 80px;

  &:hover {
    color: ${colors.text};
  }
`;

export const ReasonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.5rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const ReasonButton = styled.button<{ selected?: boolean }>`
  padding: 1rem;
  border: 2px solid
    ${({ selected }) => (selected ? colors.primary : colors.border)};
  background: ${({ selected }) =>
    selected ? colors.primaryLight : colors.white};
  color: ${colors.text};
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;

  &:hover {
    border-color: ${colors.primary};
    background: ${colors.primaryLight};
  }
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;

export const ModalButton = styled.button<{ variant?: "primary" | "secondary" }>`
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  ${({ variant = "primary" }) =>
    variant === "primary"
      ? `
    background: ${colors.error};
    color: ${colors.white};
    &:hover:not(:disabled) {
      background: #DC2626;
    }
  `
      : `
    background: ${colors.background};
    color: ${colors.text};
    &:hover:not(:disabled) {
      background: #E5E7EB;
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
export const UserStatusBadge = styled.span<{ $active: boolean }>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  background-color: ${({ $active }) => ($active ? "#d1fae5" : "#fee2e2")};
  color: ${({ $active }) => ($active ? "#065f46" : "#991b1b")};
`;

export const UserAccountStatusBadge = styled.span<{ $status: AccountStatus }>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;

  background-color: ${({ $status }) => {
    switch ($status) {
      case "ACTIVE":
        return "#d1fae5"; // 기존 활성 배경
      case "SUSPENDED":
        return "#fee2e2"; // 기존 제한 배경
      case "DELETED":
        return "#e5e7eb"; // 회색 배경
      default:
        return "#f3f4f6";
    }
  }};

  color: ${({ $status }) => {
    switch ($status) {
      case "ACTIVE":
        return "#065f46"; // 기존 활성 글자
      case "SUSPENDED":
        return "#991b1b"; // 기존 제한 글자
      case "DELETED":
        return "#4b5563"; // 회색 글자
      default:
        return "#374151";
    }
  }};
`;
