import styled from 'styled-components';
import { colors } from '@/shared/ui/CommonStyles';

export const CloseButton = styled.button`
  padding: 0.25rem;
  border: none;
  background: transparent;
  cursor: pointer;
  color: ${colors.textSecondary};
  transition: color 0.2s;

  &:hover {
    color: ${colors.text};
  }
`;

export const FilterBar = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

export const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid ${colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

export const DetailLabel = styled.span`
  color: ${colors.textSecondary};
  font-size: 0.875rem;
`;

export const DetailValue = styled.span`
  font-weight: 500;
  font-size: 0.875rem;
`;

export const CancelInfo = styled.div`
  background: ${colors.errorLight};
  padding: 1rem;
  border-radius: 0.375rem;
  margin-top: 1rem;
`;

export const CancelTitle = styled.h4`
  font-weight: 600;
  color: ${colors.error};
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`;

export const CancelText = styled.p`
  font-size: 0.875rem;
  color: ${colors.text};
`;

export const ItemSection = styled.div`
  margin: 1rem 0;
  padding: 1rem;
  background: inherit;
  border-radius: 0.5rem;
`;

export const ItemTitle = styled.h4`
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
`;

export const ItemRow = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr 0.7fr 1fr;
  gap: 0.5rem;
  padding: 0.4rem 0;
  font-size: 0.85rem;
  border-bottom: 1px solid ${colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

export const ItemHeader = styled(ItemRow)`
  font-weight: 600;
  color: ${colors.textSecondary};
  border-bottom: 2px solid ${colors.border};
`;
