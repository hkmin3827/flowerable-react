import styled from 'styled-components';

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

export const Header = styled.div`
  margin-bottom: 2rem;
  text-align: center;
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
`;

export const Subtitle = styled.p`
  color: #6b7280;
  font-size: 1rem;
`;

export const CategoryFilter = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: center;
`;

export const CategoryButton = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1.5rem;
  border: 1px solid ${(props) => (props.$active ? "#3b82f6" : "#d1d5db")};
  background-color: ${(props) => (props.$active ? "#3b82f6" : "white")};
  color: ${(props) => (props.$active ? "white" : "#374151")};
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${(props) => (props.$active ? "#2563eb" : "#f3f4f6")};
  }
`;

export const FlowerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

export const FlowerCard = styled.div`
  background: white;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
`;

export const FlowerImage = styled.img`
  width: 100%;
  height: 250px;
  object-fit: cover;
`;

export const FlowerInfo = styled.div`
  padding: 1rem;
`;

export const FlowerName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
`;

export const FlowerLang = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.75rem;
`;

export const CategoryBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background-color: #eff6ff;
  color: #3b82f6;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
`;

export const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid #f3f4f6;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const LoadingText = styled.p`
  margin-top: 1rem;
  color: #6b7280;
`;

export const EmptyContainer = styled.div`
  text-align: center;
  padding: 4rem 0;
`;

export const EmptyText = styled.p`
  color: #6b7280;
  font-size: 1.125rem;
`;

export const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
`;

export const PageButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: #f3f4f6;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const PageInfo = styled.span`
  color: #374151;
  font-size: 0.875rem;
`;
