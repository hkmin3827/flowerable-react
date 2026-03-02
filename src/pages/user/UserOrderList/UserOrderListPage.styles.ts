import styled from "styled-components";
import { colors } from "@/shared/ui/CommonStyles";
import { OrderStatus } from "@/shared/types";
import { Package, ChevronRight } from "lucide-react";

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

export const EmptyIcon = styled(Package)`
  margin: 0 auto 1rem;
  color: #d1d5db;
`;

export const EmptyText = styled.p`
  color: ${colors.textSecondary};
  font-size: 1rem;
`;

export const OrdersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const OrderCard = styled.div`
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

export const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 0.75rem;
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
export const OrderFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const PriceInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const TotalPrice = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${colors.primary};
`;

export const OrderDate = styled.p`
  font-size: 0.875rem;
  color: ${colors.textSecondary};
`;

export const ArrowIcon = styled(ChevronRight)`
  color: #9ca3af;
  flex-shrink: 0;
`;

export const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;

export const PageButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background: ${colors.background};
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${colors.border};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const PageInfo = styled.span`
  padding: 0.5rem 1rem;
  color: ${colors.text};
  font-weight: 500;
`;
