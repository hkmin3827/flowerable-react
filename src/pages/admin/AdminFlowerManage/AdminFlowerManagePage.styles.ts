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

export const FilterBar = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 1.5rem;
`;
