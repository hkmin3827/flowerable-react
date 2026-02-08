import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Hero>
        <HeroTitle>당신의 특별한 순간을 위한 꽃</HeroTitle>
        <HeroSubtitle>
          원하는 꽃을 선택하고, 가까운 꽃집에서 주문하세요
        </HeroSubtitle>
        <HeroButton onClick={() => navigate('/flowers')}>
          꽃 찾기 시작하기
        </HeroButton>
      </Hero>

      <Features>
        <Feature>
          <FeatureIcon>🌸</FeatureIcon>
          <FeatureTitle>다양한 꽃</FeatureTitle>
          <FeatureDescription>
            계절별, 색상별로 원하는 꽃을 쉽게 찾아보세요
          </FeatureDescription>
        </Feature>

        <Feature>
          <FeatureIcon>🏪</FeatureIcon>
          <FeatureTitle>가까운 꽃집</FeatureTitle>
          <FeatureDescription>
            원하는 꽃을 보유한 가까운 꽃집을 찾아드립니다
          </FeatureDescription>
        </Feature>

        <Feature>
          <FeatureIcon>💬</FeatureIcon>
          <FeatureTitle>실시간 상담</FeatureTitle>
          <FeatureDescription>
            주문 전 꽃집과 직접 상담하고 주문하세요
          </FeatureDescription>
        </Feature>
      </Features>
    </Container>
  );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Hero = styled.div`
  text-align: center;
  padding: 4rem 1rem;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #111827;
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  color: #6b7280;
  margin-bottom: 2rem;
`;

const HeroButton = styled.button`
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

const Features = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
`;

const Feature = styled.div`
  text-align: center;
  padding: 2rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: white;
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const FeatureDescription = styled.p`
  color: #6b7280;
  line-height: 1.6;
`;
