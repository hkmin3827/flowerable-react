import styled from "styled-components";

// 색상 팔레트
export const colors = {
  primary: "#3b63f2",
  primaryHover: "#294ccc",
  primaryLight: "#6b88f4",
  secondary: "#4B5563", // gray-600
  secondaryHover: "#374151", // gray-700
  success: "#10B981", // green-500
  successLight: "#D1FAE5", // green-100
  error: "#EF4444", // red-500
  errorLight: "#FEE2E2", // red-100
  warning: "#F59E0B", // amber-500
  info: "#3B82F6", // blue-500
  infoLight: "#DBEAFE", // blue-100
  text: "#111827", // gray-900
  textSecondary: "#6B7280", // gray-500
  border: "#E5E7EB", // gray-200
  background: "#F9FAFB", // gray-50
  white: "#FFFFFF",
};

// 컨테이너
export const Container = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

export const SmallContainer = styled.div`
  max-width: 64rem;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

// 카드
export const Card = styled.div`
  background: ${colors.white};
  border-radius: 0.5rem;
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px 0 rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

// 버튼
export const Button = styled.button<{
  variant?: "primary" | "secondary" | "success" | "error" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
  border-radius: 0.5rem;
  transition: all 0.15s ease-in-out;
  cursor: pointer;
  border: none;
  font-family: inherit;

  ${({ size = "md" }) => {
    switch (size) {
      case "sm":
        return `
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        `;
      case "lg":
        return `
          padding: 0.75rem 1.5rem;
          font-size: 1.125rem;
        `;
      default:
        return `
          padding: 0.625rem 1.25rem;
          font-size: 1rem;
        `;
    }
  }}

  ${({ fullWidth }) => fullWidth && `width: 100%;`}

  ${({ variant = "primary" }) => {
    switch (variant) {
      case "primary":
        return `
          background: ${colors.primary};
          color: ${colors.white};
          &:hover:not(:disabled) {
            background: ${colors.primaryHover};
          }
        `;
      case "secondary":
        return `
          background: ${colors.secondary};
          color: ${colors.white};
          &:hover:not(:disabled) {
            background: ${colors.secondaryHover};
          }
        `;
      case "success":
        return `
          background: ${colors.success};
          color: ${colors.white};
          &:hover:not(:disabled) {
            background: #059669;
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
      case "outline":
        return `
          background: transparent;
          color: ${colors.primary};
          border: 1px solid ${colors.primary};
          &:hover:not(:disabled) {
            background: ${colors.primaryLight};
          }
        `;
      case "ghost":
        return `
          background: transparent;
          color: ${colors.text};
          &:hover:not(:disabled) {
            background: ${colors.background};
          }
        `;
      default:
        return "";
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// 입력 필드
export const Input = styled.input`
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid ${colors.border};
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: all 0.15s ease-in-out;

  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px ${colors.primaryLight};
  }

  &:disabled {
    background: ${colors.background};
    cursor: not-allowed;
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid ${colors.border};
  border-radius: 0.375rem;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  transition: all 0.15s ease-in-out;

  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px ${colors.primaryLight};
  }

  &:disabled {
    background: ${colors.background};
    cursor: not-allowed;
  }
`;

export const Textarea = styled.textarea`
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid ${colors.border};
  border-radius: 0.375rem;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  transition: all 0.15s ease-in-out;

  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px ${colors.primaryLight};
  }

  &:disabled {
    background: ${colors.background};
    cursor: not-allowed;
  }
`;

// 헤더
export const PageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

export const PageTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: bold;
  color: ${colors.text};
`;

// 섹션
export const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  color: ${colors.text};
  margin-bottom: 1rem;
`;

// 배지
export const Badge = styled.span<{
  variant?:
    | "pending"
    | "primary"
    | "success"
    | "error"
    | "warning"
    | "info"
    | "secondary";
}>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;

  ${({ variant = "primary" }) => {
    switch (variant) {
      case "primary":
        return `
          background: ${colors.primaryLight};
          color: ${colors.primary};
        `;
      case "pending":
        return `
          background: #f5e5f9;
          color: #983cb1;
        `;
      case "success":
        return `
          background: ${colors.successLight};
          color: ${colors.success};
        `;
      case "error":
        return `
          background: ${colors.errorLight};
          color: ${colors.error};
        `;
      case "warning":
        return `
          background: #FEF3C7;
          color: ${colors.warning};
        `;
      case "info":
        return `
          background: ${colors.infoLight};
          color: ${colors.info};
        `;
      case "secondary":
        return `
          background: #F3F4F6;
          color: ${colors.secondary};
        `;
      default:
        return "";
    }
  }}
`;

// 로딩 스피너
export const LoadingSpinner = styled.div`
  display: inline-block;
  width: 1.5rem;
  height: 1.5rem;
  border: 3px solid ${colors.border};
  border-top-color: ${colors.primary};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  color: ${colors.textSecondary};
  font-size: 1rem;
`;

// 그리드
export const Grid = styled.div<{ columns?: number; gap?: string }>`
  display: grid;
  grid-template-columns: repeat(${({ columns = 1 }) => columns}, 1fr);
  gap: ${({ gap = "1.5rem" }) => gap};

  @media (max-width: 1024px) {
    grid-template-columns: repeat(
      ${({ columns = 1 }) => Math.max(1, columns - 1)},
      1fr
    );
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// Flex
export const Flex = styled.div<{
  direction?: "row" | "column";
  justify?: "start" | "center" | "end" | "between" | "around";
  align?: "start" | "center" | "end" | "stretch";
  gap?: string;
  wrap?: boolean;
}>`
  display: flex;
  flex-direction: ${({ direction = "row" }) => direction};
  ${({ justify = "start" }) => {
    const justifyMap = {
      start: "flex-start",
      center: "center",
      end: "flex-end",
      between: "space-between",
      around: "space-around",
    };
    return `justify-content: ${justifyMap[justify]};`;
  }}
  ${({ align = "stretch" }) => {
    const alignMap = {
      start: "flex-start",
      center: "center",
      end: "flex-end",
      stretch: "stretch",
    };
    return `align-items: ${alignMap[align]};`;
  }}
  gap: ${({ gap = "0" }) => gap};
  ${({ wrap }) => wrap && "flex-wrap: wrap;"}
`;

// 모달
export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1rem;
`;

export const ModalContent = styled.div<{ width?: string }>`
  background: ${colors.white};
  border-radius: 0.5rem;
  padding: 1.5rem;
  width: 100%;
  max-width: ${({ width = "32rem" }) => width};
  max-height: 90vh;
  overflow-y: auto;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
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

export const ModalBody = styled.div`
  margin-bottom: 1.5rem;
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;

// 테이블
export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHead = styled.thead`
  background: ${colors.background};
  border-bottom: 2px solid ${colors.border};
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
  border-bottom: 1px solid ${colors.border};
  transition: background-color 0.15s;

  &:hover {
    background: ${colors.background};
  }
`;

export const TableHeader = styled.th`
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  color: ${colors.text};
  font-size: 0.875rem;
`;

export const TableCell = styled.td`
  padding: 0.75rem 1rem;
  color: ${colors.text};
  font-size: 0.875rem;
`;

// 검색바
export const SearchBar = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

// 빈 상태
export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: ${colors.textSecondary};
  font-size: 1rem;
`;

// 탭
export const TabList = styled.div`
  display: flex;
  gap: 0.5rem;
  border-bottom: 2px solid ${colors.border};
  margin-bottom: 1.5rem;
`;

export const Tab = styled.button<{ $active?: boolean }>`
  padding: 0.75rem 1.5rem;
  border: none;
  background: transparent;
  color: ${({ $active: $active }) =>
    $active ? colors.primary : colors.textSecondary};
  font-weight: ${({ $active: $active }) => ($active ? "600" : "500")};
  border-bottom: 2px solid
    ${({ $active: $active }) => ($active ? colors.primary : "transparent")};
  margin-bottom: -2px;
  cursor: pointer;
  transition: all 0.15s;
  font-size: 1rem;

  &:hover {
    color: ${colors.primary};
  }
`;

// 페이지네이션
export const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;

export const PageButton = styled.button<{ active?: boolean }>`
  padding: 0.5rem 0.75rem;
  border: 1px solid ${({ active }) => (active ? colors.primary : colors.border)};
  background: ${({ active }) => (active ? colors.primary : colors.white)};
  color: ${({ active }) => (active ? colors.white : colors.text)};
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.15s;
  font-size: 0.875rem;

  &:hover:not(:disabled) {
    border-color: ${colors.primary};
    background: ${({ active }) =>
      active ? colors.primaryHover : colors.primaryLight};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Form 그룹
export const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: ${colors.text};
  font-size: 0.875rem;
`;

export const ErrorText = styled.p`
  color: ${colors.error};
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

// 정보 행
export const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  color: ${colors.text};
`;

export const InfoLabel = styled.span`
  color: ${colors.textSecondary};
  font-size: 0.875rem;
  min-width: 100px;
`;

export const InfoValue = styled.span`
  font-weight: 500;
`;
