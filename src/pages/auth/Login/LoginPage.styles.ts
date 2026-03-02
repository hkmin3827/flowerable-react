import styled from 'styled-components';

export const Container = styled.div`
  max-width: 500px;
  margin: 3rem auto;
  padding: 2rem;
`;

export const TypeSelector = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

export const TypeButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 0.75rem;
  border: 2px solid ${({ $active }) => ($active ? "#3b82f6" : "#d1d5db")};
  background-color: ${({ $active }) => ($active ? "#eff6ff" : "white")};
  color: ${({ $active }) => ($active ? "#3b82f6" : "#6b7280")};
  font-weight: 600;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #3b82f6;
  }
`;

export const SuccessBanner = styled.div`
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #15803d;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
  text-align: center;
`;
