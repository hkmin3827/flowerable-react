import styled from 'styled-components';

export const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

export const CartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
`;

export const ClearButton = styled.button`
  padding: 0.5rem 1rem;
  background: #bcbcbc;
  color: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  &:hover {
    background: #dc2626;
    color: white;
  }
`;

export const CartContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

export const CartItemCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
`;

export const ShopHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f7ca23;
`;

export const ShopName = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
`;

export const RemoveShopButton = styled.button`
  padding: 0.25rem 0.75rem;
  background: #bcbcbc;
  color: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  &:hover {
    background: #dc2626;
    color: white;
  }
`;

export const ShopInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 1rem;
`;

export const InfoText = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
`;

export const FlowerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

export const FlowerItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: #fff18340;
  border-radius: 0.5rem;
`;

export const FlowerImage = styled.img`
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 0.375rem;
  flex-shrink: 0;
`;

export const FlowerInfo = styled.div`
  flex: 1;
`;

export const FlowerName = styled.div`
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.125rem;
`;

export const FlowerDetail = styled.div`
  font-size: 0.8rem;
  color: #6b7280;
`;

export const FlowerPrice = styled.div`
  font-weight: 600;
  color: #000;
`;

export const ItemFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
`;

export const ItemTotalBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const TotalLabel = styled.div`
  font-weight: 500;
  color: #374151;
`;

export const TotalPrice = styled.div`
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
`;

export const OrderItemButton = styled.button`
  padding: 0.625rem 1.25rem;
  background: linear-gradient(135deg, #3b63f2, #294ccc);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.925rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.9;
  }
`;

export const Summary = styled.div`
  background: white;
  border: 2px solid #3b63f2;
  border-radius: 0.75rem;
  padding: 1.5rem;
`;

export const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

export const SummaryLabel = styled.div`
  color: #6b7280;
`;

export const SummaryValue = styled.div`
  font-weight: 600;
  color: #111827;
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 1rem 0;
`;

export const GrandTotal = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`;

export const GrandTotalLabel = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
`;

export const GrandTotalPrice = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b63f2;
`;

export const SummaryNote = styled.div`
  font-size: 0.825rem;
  color: #9ca3af;
  text-align: center;
`;

export const EmptyCart = styled.div`
  text-align: center;
  padding: 4rem 1rem;
`;

export const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

export const EmptyText = styled.div`
  font-size: 1.25rem;
  color: #6b7280;
  margin-bottom: 2rem;
`;

export const GoShoppingButton = styled.button`
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, #3b63f2, #294ccc);
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

export const LoadingText = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: 1.125rem;
  color: #6b7280;
`;
