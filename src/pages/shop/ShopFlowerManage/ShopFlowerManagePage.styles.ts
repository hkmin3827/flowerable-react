import styled from 'styled-components';

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
`;

export const TitleSection = styled.div``;

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

export const AddButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    background-color: #2563eb;
  }
`;

export const FilterSection = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

export const FilterButton = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1.25rem;
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
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

export const FlowerCard = styled.div`
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
`;

export const FlowerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`;

export const FlowerName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
`;

export const StatusBadge = styled.span<{ $active: boolean }>`
  padding: 0.25rem 0.75rem;
  background-color: ${(props) => (props.$active ? "#dcfce7" : "#fee2e2")};
  color: ${(props) => (props.$active ? "#16a34a" : "#dc2626")};
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
`;

export const FlowerPrice = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 1rem;
`;

export const ColorSection = styled.div`
  margin-bottom: 1rem;
`;

export const ColorLabel = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

export const ColorList = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

export const ColorChip = styled.span<{ $color: string }>`
  padding: 0.25rem 0.75rem;
  background-color: ${(props) =>
    props.$color.toLowerCase() === "#ffffff" ? "#ffffff" : `${props.$color}20`};

  color: ${(props) =>
    props.$color.toLowerCase() === "#ffffff" ? "#666" : props.$color};

  border: 1px solid
    ${(props) =>
      props.$color.toLowerCase() === "#ffffff" ? "#666" : props.$color};
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
`;

export const ButtonGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-top: 1rem;
`;

export const EditButton = styled.button`
  padding: 0.5rem;
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

export const ToggleButton = styled.button<{ $active: boolean }>`
  padding: 0.5rem;
  background-color: ${(props) => (props.$active ? "#fee2e2" : "#dcfce7")};
  color: ${(props) => (props.$active ? "#dc2626" : "#16a34a")};
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    opacity: 0.8;
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

export const EmptyContainer = styled.div`
  text-align: center;
  padding: 4rem 0;
`;

export const EmptyText = styled.p`
  color: #6b7280;
  font-size: 1.125rem;
  margin-bottom: 1.5rem;
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

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const Modal = styled.div`
  background: white;
  border-radius: 0.5rem;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
`;

export const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 2rem;
  color: #6b7280;
  cursor: pointer;
  padding: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #111827;
  }
`;

export const ModalForm = styled.form`
  padding: 1.5rem;
`;

export const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

export const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

export const ColorPalette = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.75rem;
`;

export const ColorOption = styled.button<{ $background?: string; $selected: boolean }>`
  aspect-ratio: 1;
  background-color: ${(props) => props.$background};
  border: 3px solid ${(props) => (props.$selected ? "#111827" : "#e5e7eb")};
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: scale(1.1);
    border-color: ${(props) => (props.$selected ? "#111827" : "#d1d5db")};
  }
`;

export const CheckMark = styled.span`
  font-size: 1.5rem;
  color: #111827;
  font-weight: 700;
  text-shadow: 0 0 2px white;
`;

export const ModalButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

export const CancelButton = styled.button`
  padding: 0.625rem 1.5rem;
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

export const SubmitButton = styled.button`
  padding: 0.625rem 1.5rem;
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
