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
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
`;

export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
`;

export const EditButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2563eb;
  }
`;

export const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

export const Input = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

export const StatusBadge = styled.span<{ $active: boolean }>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  background-color: ${({ $active }) => ($active ? "#d1fae5" : "#fee2e2")};
  color: ${({ $active }) => ($active ? "#065f46" : "#991b1b")};
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

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  justify-content: flex-end;
`;

export const CancelButton = styled.button`
  padding: 0.5rem 1.5rem;
  background-color: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e5e7eb;
  }
`;

export const SaveButton = styled.button`
  padding: 0.5rem 1.5rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2563eb;
  }
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
