import styled from "styled-components";

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

export const Hero = styled.div`
  text-align: center;
  padding: 4rem 1rem;
`;

export const HeroTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #111827;
`;

export const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  color: #6b7280;
  margin-bottom: 2rem;
`;

export const HeroButton = styled.button`
  padding: 1rem 2rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: white;
  background-color: #3b82f6;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2563eb;
  }
`;

export const Features = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
`;

export const Feature = styled.div`
  text-align: center;
  padding: 2rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: white;
`;

export const FeatureIcon = styled.div`
  width: 70px;
  font-size: 3rem;
  margin: 0 auto;
`;

export const FeatureTitle = styled.h3`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 15px;
  margin-bottom: 0.5rem;
`;

export const FeatureDescription = styled.p`
  color: #6b7280;
  line-height: 1.6;
`;

export const NewBadge = styled.span`
  display: inline-block;
  padding: 0.2rem 0.6rem;
  font-size: 0.7rem;
  font-weight: 700;
  color: white;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-radius: 999px;
  letter-spacing: 0.05em;
`;

export const AIChatbotFeature = styled.button`
  grid-column: 1 / -1;
  text-align: center;
  padding: 2rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: white;
  cursor: pointer;
  font-family: inherit;
  transition:
    border-color 0.2s,
    background 0.2s;
  border-color: #3b82f6;

  &:hover {
    border-color: #bfdbfe;
    background: #eff6ff;
  }
`;
