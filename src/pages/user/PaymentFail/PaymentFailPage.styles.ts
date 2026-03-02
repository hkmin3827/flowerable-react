import styled from 'styled-components';

export const Container = styled.div`
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

export const Card = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  padding: 3rem 2rem;
  text-align: center;
  max-width: 420px;
  width: 100%;
`;

export const Icon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.75rem;
`;

export const Desc = styled.p`
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 0.75rem;
`;

export const ErrorCode = styled.div`
  font-size: 0.75rem;
  color: #9ca3af;
  background: #f3f4f6;
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  display: inline-block;
  margin-bottom: 2rem;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
`;

export const RetryButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #ec4899, #db2777);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;

export const HomeButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: white;
  color: #374151;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background: #f3f4f6;
  }
`;
