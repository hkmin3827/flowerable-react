import styled from "styled-components";

export const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

export const OrderCard = styled.div`
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 2rem;
`;

export const ShopInfoBox = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #f7ca23;
`;

export const ShopName = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
`;

export const ShopDetail = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
`;

export const Section = styled.div`
  margin-bottom: 2rem;
`;

export const SectionTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #f3f4f6;
`;

export const FlowerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`;

export const FlowerCard = styled.div`
  border: 1px solid #f7ca23;
  border-radius: 0.5rem;
  overflow: hidden;
  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: 0 4px 12px rgba(255, 251, 2, 0.15);
  }
`;

export const FlowerInfo = styled.div`
  padding: 1rem;
`;

export const FlowerName = styled.div`
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.25rem;
`;

export const FlowerPrice = styled.div`
  color: #000;
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
`;

export const ColorSelect = styled.div`
  display: flex;
  gap: 0.375rem;
  flex-wrap: wrap;
`;

export const ColorButton = styled.button`
  padding: 0.25rem 0.625rem;
  background: #fffff9;
  border: 1px solid #f7ca23;
  border-radius: 9999px;
  font-size: 0.75rem;
  cursor: pointer;
  color: #000;
  transition: all 0.2s;
  &:hover {
    background: #f7ca23;
    color: black;
    border-color: #f8c612;
  }
`;

export const SelectionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const SelectionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.875rem 1rem;
  background: #f3f5ff;
  border-radius: 0.5rem;
  border: 1px solid #6b88f4;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

export const SelectionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.9rem;
  color: #374151;
  @media (max-width: 480px) {
    width: 100%;
    justify-content: space-between;
  }
`;

export const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const QuantityButton = styled.button`
  width: 1.75rem;
  height: 1.75rem;
  background: #3b63f2;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 1rem;
  &:hover {
    background: #3b63f2;
  }
`;

export const QuantityValue = styled.span`
  min-width: 2rem;
  text-align: center;
  font-weight: 600;
`;

export const SelectionPrice = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 600;
  color: #111827;
  @media (max-width: 480px) {
    width: 100%;
    justify-content: space-between;
  }
`;

export const RemoveButton = styled.button`
  padding: 0.25rem 0.625rem;
  background: #bcbcbc;
  color: #ffffff;
  border: 1px solid #d9d9d9;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  cursor: pointer;
  &:hover {
    background: #dc2626;
    color: white;
  }
`;

export const TotalSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
`;

export const TotalLabel = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
`;

export const TotalPrice = styled.div`
  font-size: 1.375rem;
  font-weight: 700;
  color: #3b63f2;
`;

export const ButtonGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

export const AddToCartButton = styled.button`
  padding: 1rem;
  background: white;
  color: #3b63f2;
  border: 2px solid #3b63f2;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  word-break: keep-all;
  &:hover {
    background: #f3f5ff;
  }
`;

export const OrderButton = styled.button`
  padding: 1rem;
  background: linear-gradient(135deg, #3b63f2, #294ccc);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
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

export const ErrorText = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: 1.125rem;
  color: #ef4444;
`;
