import styled from "styled-components";
import { colors } from "@/shared/ui/CommonStyles";

export const Container = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

export const ShopCard = styled.div`
  background: ${colors.white};
  border-radius: 0.75rem;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 2rem;
  margin-bottom: 2rem;
`;

export const ShopName = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: ${colors.text};
  margin-bottom: 1rem;
`;

export const Description = styled.p`
  color: ${colors.textSecondary};
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

export const InfoGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

export const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  color: ${colors.textSecondary};

  svg {
    flex-shrink: 0;
    margin-top: 0.25rem;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

export const ActionButton = styled.button<{
  variant?: "primary" | "secondary";
}>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;

  ${({ variant = "primary" }) =>
    variant === "primary"
      ? `
    background: ${colors.primary};
    color: ${colors.white};
    
    &:hover {
      background: ${colors.primaryHover};
      transform: translateY(-1px);
      box-shadow: 0 4px 6px -1px rgba(33, 29, 234, 0.3);
    }
  `
      : `
    background: ${colors.secondary};
    color: ${colors.white};
    
    &:hover {
      background: ${colors.secondaryHover};
      transform: translateY(-1px);
      box-shadow: 0 4px 6px -1px rgba(75, 85, 99, 0.3);
    }
  `}
`;
export const FlowersSection = styled.div`
  background: ${colors.white};
  border-radius: 0.75rem;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 2rem;
`;

export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${colors.text};
  margin-bottom: 1.5rem;
`;

export const FlowerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const FlowerCard = styled.div`
  border: 1px solid ${colors.border};
  border-radius: 0.5rem;
  padding: 1.5rem;
  transition: all 0.2s;

  &:hover {
    border-color: ${colors.primary};
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

export const FlowerName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${colors.text};
  margin-bottom: 0.75rem;
`;

export const FlowerPrice = styled.p`
  font-size: 1.25rem;
  font-weight: bold;
  color: ${colors.primary};
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: ${colors.textSecondary};
`;

export const ThumbnailWrapper = styled.div`
  margin-top: 30px;
`;

export const ThumbnailImage = styled.img`
  width: 200px;
  max-height: 400px;
  object-fit: cover;
  border-radius: 0.75rem;
`;

export const ImageSection = styled.div``;

export const ImageHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 1rem;
`;

export const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
`;

export const ImageCard = styled.div`
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 0.5rem;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const MoreButton = styled.button`
  background: none;
  border: none;
  color: ${colors.primary};
  cursor: pointer;
  font-weight: 600;
`;
