import styled from 'styled-components';
import { colors } from '@/shared/ui/CommonStyles';

export const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

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

export const FilterBar = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;
