import styled from 'styled-components';
import { colors } from '@/shared/ui/CommonStyles';

export const UploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const PreviewContainer = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  border: 2px dashed ${colors.border};
  border-radius: 0.5rem;
  overflow: hidden;
  background: ${colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const RemoveButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.5rem;
  background: ${colors.error};
  color: ${colors.white};
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: #dc2626;
  }
`;

export const UploadButton = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: ${colors.primary};
  color: ${colors.white};
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    background: ${colors.primaryHover};
  }

  input {
    display: none;
  }
`;

export const UploadingText = styled.p`
  color: ${colors.textSecondary};
  font-size: 0.875rem;
`;
