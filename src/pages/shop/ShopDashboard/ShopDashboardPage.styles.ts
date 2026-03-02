import styled from 'styled-components';

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 1rem;
`;

export const Header = styled.div`
  margin-bottom: 3rem;
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #111827;
`;

export const Subtitle = styled.p`
  color: #6b7280;
  margin-top: 0.5rem;
`;

export const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;

  h2 {
    font-size: 1.25rem;
    font-weight: 600;
  }
`;

export const MoreButton = styled.button`
  background: none;
  border: none;
  color: #3b82f6;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

export const OrderItem = styled.div`
  padding: 1rem 0;
  border-top: 1px solid #f3f4f6;
  cursor: pointer;

  &:hover {
    background: #f9fafb;
  }
`;

export const OrderTop = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const OrderBottom = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
`;

export const OrderNumber = styled.span`
  font-size: 0.9rem;
  color: #6b7280;
`;

export const StatusBadge = styled.span`
  font-size: 0.75rem;
  background: #fee2e2;
  color: #991b1b;
  padding: 0.25rem 0.5rem;
  border-radius: 999px;
`;

export const Price = styled.span`
  font-weight: 600;
  color: #ed8003;
`;

export const DateText = styled.span`
  font-size: 0.75rem;
  color: #9ca3af;
`;

export const Empty = styled.div`
  text-align: center;
  padding: 2rem 0;
  color: #9ca3af;
`;

export const FlowerItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 0;
  border-top: 1px solid #f3f4f6;
`;

export const Rank = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  width: 40px;
`;

export const FlowerInfo = styled.div`
  flex: 1;
`;

export const FlowerName = styled.div`
  font-weight: 600;
`;

export const OrderCount = styled.div`
  font-size: 0.85rem;
  color: #6b7280;
`;

export const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-top: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const ActionCard = styled.button`
  padding: 1.5rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background: #f9fafb;
  }
`;
