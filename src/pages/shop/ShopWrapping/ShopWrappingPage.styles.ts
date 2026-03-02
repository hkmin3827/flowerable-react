import styled from 'styled-components';

export const Container = styled.div`
  max-width: 800px;
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

export const ContentCard = styled.div`
  background: white;
  border-radius: 0.5rem;
  padding: 2rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

export const Section = styled.div`
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
`;

export const SectionDescription = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1.5rem;
`;

export const ColorPalette = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1.5rem;
  margin-bottom: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const ColorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

export const ColorOption = styled.button<{ $background?: string; $selected: boolean }>`
  width: 100%;
  aspect-ratio: 1;
  background: ${(props) => props.$background};
  border: 4px solid ${(props) => (props.$selected ? "#111827" : "#e5e7eb")};
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${(props) =>
    props.$selected ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)" : "none"};

  &:hover {
    transform: scale(1.05);
    border-color: ${(props) => (props.$selected ? "#111827" : "#d1d5db")};
  }
`;

export const CheckMark = styled.span<{ $lightColor: boolean }>`
  font-size: 1.5rem;
  color: #111827;
  font-weight: 700;
  text-shadow: 0 0 2px white;
`;

export const ColorLabel = styled.span`
  font-size: 0.875rem;
  color: #374151;
  font-weight: 500;
  text-align: center;
`;

export const SelectedInfo = styled.div`
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #374151;
  border: 1px solid #e5e7eb;
`;

export const Divider = styled.div`
  height: 1px;
  background-color: #e5e7eb;
  margin: 2rem 0;
`;

export const PriceInputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  max-width: 300px;
  margin-bottom: 1rem;
`;

export const PriceInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 600;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

export const PriceUnit = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
`;

export const PricePreview = styled.div`
  padding: 1rem;
  background-color: #eff6ff;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #1e40af;
  border: 1px solid #dbeafe;
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
`;

export const ResetButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #e5e7eb;
  }
`;

export const SaveButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: #2563eb;
  }

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
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
