import styled from "styled-components";
import { colors } from "@/shared/ui/CommonStyles";
import { OrderStatus } from "@/shared/types";

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
      case "CREATED":
        return `background: #FEF3C7; color: #D97706;`;
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

export const Button = styled.button`
  width: 100%;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  background: ${colors.error};
  color: ${colors.white};

  &:hover:not(:disabled) {
    background: #dc2626;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const DisabledButton = styled(Button)`
  background: ${colors.border};
  color: ${colors.textSecondary};
  cursor: not-allowed;

  &:hover {
    background: ${colors.border};
  }
`;

export const PaymentRetryCard = styled(Card)`
  border: 2px dashed #f59e0b;
  background: #fffbeb;
`;

export const PaymentRetryTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 700;
  color: #92400e;
  margin-bottom: 0.5rem;
`;

export const PaymentRetryDesc = styled.p`
  font-size: 0.875rem;
  color: #b45309;
  margin-bottom: 1.25rem;
  line-height: 1.5;
`;

export const PaymentMethodList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
`;

export const PaymentMethodItem = styled.div<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: 2px solid ${(p) => (p.$selected ? "#3b63f2" : "#e5e7eb")};
  border-radius: 0.5rem;
  cursor: pointer;
  background: ${(p) => (p.$selected ? "#f3f5ff" : "white")};
  transition: all 0.2s;

  &:hover {
    border-color: #3b63f2;
  }
`;

export const MethodRadio = styled.div<{ $selected: boolean }>`
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  border: 2px solid ${(p) => (p.$selected ? "#3b63f2" : "#d1d5db")};
  background: ${(p) => (p.$selected ? "#3b63f2" : "white")};
  flex-shrink: 0;
  transition: all 0.2s;
`;

export const MethodLabel = styled.span`
  font-weight: 600;
  color: #111827;
  font-size: 0.875rem;
`;

export const MethodDesc = styled.span`
  color: #6b7280;
  font-size: 0.75rem;
  margin-left: 0.25rem;
`;

export const PayButton = styled.button`
  width: 100%;
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #3b63f2, #294ccc);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
