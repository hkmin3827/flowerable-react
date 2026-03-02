import styled from "styled-components";
import { colors } from "@/shared/ui/CommonStyles";

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

export const BackButton = styled.button`
  padding: 0.5rem;
  border: none;
  background: transparent;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: ${colors.background};
  }
`;

export const PageTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: bold;
  color: ${colors.text};
`;

export const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background: ${colors.white};
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const UploadButton = styled.label<{ disabled?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: ${(props) =>
    props.disabled ? colors.background : colors.primary};
  color: ${(props) => (props.disabled ? colors.textSecondary : colors.white)};
  border-radius: 0.5rem;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    background: ${(props) =>
      props.disabled ? colors.background : colors.primaryHover};
  }
`;

export const ImageCount = styled.span`
  color: ${colors.textSecondary};
  font-size: 0.875rem;
`;

export const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

export const ImageCard = styled.div`
  background: ${colors.white};
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

export const ImageWrapper = styled.div`
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  cursor: pointer;
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s;

  ${ImageWrapper}:hover & {
    transform: scale(1.05);
  }
`;

export const ThumbnailBadge = styled.div`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.75rem;
  background: ${colors.primary};
  color: ${colors.white};
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
`;

export const ImageActions = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem;
`;

export const ActionButton = styled.button<{
  variant: "primary" | "secondary" | "danger";
}>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.5rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  ${({ variant }) => {
    switch (variant) {
      case "primary":
        return `
          background: ${colors.primary};
          color: ${colors.white};
          &:hover {
            background: ${colors.primaryHover};
          }
        `;
      case "secondary":
        return `
          background: ${colors.background};
          color: ${colors.text};
          &:hover {
            background: ${colors.border};
          }
        `;
      case "danger":
        return `
          background: ${colors.errorLight};
          color: ${colors.error};
          &:hover {
            background: ${colors.error};
            color: ${colors.white};
          }
        `;
    }
  }}
`;

export const ImageDate = styled.div`
  padding: 0.75rem;
  border-top: 1px solid ${colors.border};
  font-size: 0.75rem;
  color: ${colors.textSecondary};
  text-align: center;
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
  border: 4px solid ${colors.background};
  border-top-color: ${colors.primary};
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
  color: ${colors.textSecondary};
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 1rem;
`;

export const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

export const EmptyText = styled.p`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${colors.text};
  margin-bottom: 0.5rem;
`;

export const EmptySubText = styled.p`
  font-size: 0.875rem;
  color: ${colors.textSecondary};
`;

export const ImageModal = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
`;

export const ModalContent = styled.div`
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: -3rem;
  right: 0;
  padding: 0.5rem;
  background: ${colors.white};
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: ${colors.background};
  }
`;

export const ModalImage = styled.img`
  max-width: 100%;
  max-height: 85vh;
  object-fit: contain;
  border-radius: 0.5rem;
`;
