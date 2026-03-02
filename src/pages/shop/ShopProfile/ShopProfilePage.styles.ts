import { AccountStatus } from "@/shared/types";
import styled from "styled-components";

export const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

export const ProfileCard = styled.div`
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 2rem;
`;

export const Header = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
`;

export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
`;

export const InfoBadge = styled.div`
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: #eff6ff;
  color: #1e40af;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
`;

export const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

export const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const Label = styled.div`
  font-weight: 600;
  color: #6b7280;
  min-width: 120px;
`;

export const Value = styled.div`
  color: #111827;
  flex: 1;
`;

export const ShopStatusBadge = styled.span<{ $status: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  background-color: ${({ $status }) => {
    if ($status === "ACTIVE") return "#d1fae5";
    if ($status === "REJECTED") return "#fee2e2";
    return "#fef3c7";
  }};
  color: ${({ $status }) => {
    if ($status === "ACTIVE") return "#065f46";
    if ($status === "REJECTED") return "#991b1b";
    return "#92400e";
  }};
`;

export const AccountStatusBadge = styled.span<{ $status: AccountStatus }>`
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

export const Notice = styled.div`
  background-color: #f9fafb;
  border-left: 4px solid #3b82f6;
  padding: 1rem;
  border-radius: 0.375rem;
`;

export const NoticeTitle = styled.div`
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
`;

export const NoticeText = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
`;

export const LoadingText = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: 1.125rem;
  color: #6b7280;
`;

export const ErrorText = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: 1.125rem;
  color: #ef4444;
`;

export const WithdrawButton = styled.button`
  padding: 5px 0;
  margin-top: 50px;
  width: 100%;
  border-radius: 999px;
  cursor: pointer;
  border: none;
  background-color: #eeeeee;
  color: #666;

  &:hover {
    color: #fff;
    background-color: #e11111;
  }
`;
