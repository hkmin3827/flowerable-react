import styled from "styled-components";

export const Container = styled.div`
  max-width: 640px;
  margin: 0 auto;
  padding: 1.5rem 1rem 6rem;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

export const BackBtn = styled.button`
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  cursor: pointer;
  color: #374151;
  font-size: 0.875rem;
  &:hover {
    background: #f3f4f6;
  }
`;

export const PageTitle = styled.h1`
  font-size: 1.375rem;
  font-weight: 700;
  color: #111827;
`;

export const Card = styled.div`
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  padding: 1.25rem 1.5rem;
  margin-bottom: 1rem;
`;

export const CardTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
`;

export const ItemRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f3f4f6;
  &:last-child {
    border-bottom: none;
  }
`;

export const ItemName = styled.span`
  color: #374151;
  font-size: 0.9rem;
`;

export const ItemRight = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
`;

export const ItemQty = styled.span`
  color: #9ca3af;
  font-size: 0.875rem;
`;

export const ItemPrice = styled.span`
  font-weight: 600;
  color: #111827;
  font-size: 0.9rem;
`;

export const WrappingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 0.75rem;
  margin-top: 0.75rem;
`;

export const WrappingItem = styled.div<{ $selected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.875rem;
  border: 2px solid ${(p) => (p.$selected ? "#3b63f2" : "#e5e7eb")};
  border-radius: 0.5rem;
  cursor: pointer;
  background: ${(p) => (p.$selected ? "#f3f5ff" : "white")};
  transition: all 0.2s;
  text-align: center;
  &:hover {
    border-color: #3b63f2;
  }
`;

export const WrappingLabel = styled.div`
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
`;

export const WrappingPrice = styled.div`
  color: #6b7280;
  font-size: 0.75rem;
  margin-top: 0.25rem;
`;

export const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-family: inherit;
  font-size: 0.9rem;
  resize: none;
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-color: #3b63f2;
    box-shadow: 0 0 0 3px rgba(35, 39, 255, 0.1);
  }
`;

export const CharCount = styled.div`
  text-align: right;
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 0.25rem;
`;

export const PaymentMethodList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`;

export const PaymentMethodItem = styled.div<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1rem;
  border: 2px solid ${(p) => (p.$selected ? "#3b63f2" : "#e5e7eb")};
  border-radius: 0.5rem;
  cursor: pointer;
  background: ${(p) => (p.$selected ? "#f3f5ff" : "white")};
  transition: all 0.2s;
  &:hover {
    border-color: #3b63f2;
  }
`;

export const MethodRadio = styled.div<{ $selected: boolean }>`
  width: 1.125rem;
  height: 1.125rem;
  border-radius: 50%;
  border: 2px solid ${(p) => (p.$selected ? "#f7ca23" : "#d1d5db")};
  background: ${(p) => (p.$selected ? "#fffde5" : "white")};
  flex-shrink: 0;
  transition: all 0.2s;
`;

export const MethodInfo = styled.div`
  flex: 1;
`;

export const MethodLabel = styled.div`
  font-weight: 600;
  color: #111827;
  font-size: 0.9rem;
`;

export const MethodDesc = styled.div`
  color: #6b7280;
  font-size: 0.75rem;
`;

export const TossLogo = styled.div`
  font-size: 0.7rem;
  color: #9ca3af;
  background: #f3f4f6;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
`;

export const PriceSummary = styled.div`
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  padding: 1.25rem 1.5rem;
  margin-bottom: 1rem;
`;

export const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.375rem 0;
`;

export const PriceLabel = styled.span`
  color: #6b7280;
  font-size: 0.9rem;
`;

export const PriceValue = styled.span`
  color: #374151;
  font-weight: 500;
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 0.625rem 0;
`;

export const TotalLabel = styled.span`
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
`;

export const TotalValue = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
`;

export const PayButton = styled.button`
  width: 100%;
  padding: 1.125rem;
  background: linear-gradient(135deg, #3b63f2, #294ccc);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-size: 1.125rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s;
  margin-top: 0.5rem;
  &:hover:not(:disabled) {
    opacity: 0.9;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const PreviewSection = styled.div`
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  padding: 1.25rem 1.5rem;
  margin-bottom: 1rem;
  border: 1.5px dashed #3b63f2;
`;

export const PreviewHeader = styled.div`
  margin-bottom: 1rem;
`;

export const PreviewTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.25rem;
`;

export const PreviewSubtitle = styled.p`
  font-size: 0.8rem;
  color: #9ca3af;
  margin: 0;
`;

export const PreviewPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem 0;
`;

export const PlaceholderEmoji = styled.div`
  font-size: 2.5rem;
`;

export const PlaceholderText = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;
  margin: 0;
`;

export const ErrorText = styled.p`
  font-size: 0.8rem;
  color: #ef4444;
  text-align: center;
  margin: 0;
`;

export const PreviewBtn = styled.button`
  padding: 0.625rem 1.5rem;
  background: linear-gradient(135deg, #f7ca23, #3b63f2);
  color: white;
  border: none;
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.9;
  }
`;

export const PreviewImageWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
`;

export const PreviewImage = styled.img`
  width: 100%;
  max-width: 360px;
  border-radius: 0.75rem;
  object-fit: cover;
  box-shadow: 0 2px 12px rgba(236, 72, 153, 0.15);
`;

export const RegenerateBtn = styled.button`
  padding: 0.5rem 1.25rem;
  background: transparent;
  border: 1.5px solid #3b63f2;
  border-radius: 2rem;
  color: #3b63f2;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  &:hover:not(:disabled) {
    background: #fdf2f8;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const LoadingWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 0;
`;

export const Spinner = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border: 3px solid #f3f5ff;
  border-top-color: #3b63f2;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const LoadingText = styled.p`
  font-size: 0.875rem;
  color: #3b63f2;
  font-weight: 500;
  margin: 0;
`;
