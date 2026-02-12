import { useNavigate } from "react-router-dom";
import styled from "styled-components";

export const ShopPendingHome = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Hero>
        <HeroTitle>신규 회원님을 환영합니다.</HeroTitle>
        <HeroSubtitle>
          관리자에 의해 확인 후 승인이 가능하니 기다려주세요.{" "}
        </HeroSubtitle>
        <HeroButton onClick={() => navigate("/flowers")}>
          FLOWERABLE에서 등록 가능한 꽃 구경하러 가기
        </HeroButton>
      </Hero>

      <Features>
        <Feature>
          <FeatureIcon>🌸</FeatureIcon>
          <FeatureTitle>다양한 꽃</FeatureTitle>
          <FeatureDescription>
            계절별, 색상별로 가게에서 판매 중인 <br />
            꽃을 쉽게 등록해보세요
          </FeatureDescription>
        </Feature>

        <Feature>
          <FeatureIcon>🏪</FeatureIcon>
          <FeatureTitle>지역별 꽃집</FeatureTitle>
          <FeatureDescription>
            고객이 원하는 꽃이 등록되어 있다면
            <br /> 우리 가게를 리스트에서 볼 수 있어요
          </FeatureDescription>
        </Feature>

        <Feature>
          <FeatureIcon>💬</FeatureIcon>
          <FeatureTitle>실시간 상담</FeatureTitle>
          <FeatureDescription>
            고객들과 실시간으로 소통이 가능합니다
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
