import { useNavigate } from "react-router-dom";
import {
  Container,
  Hero,
  HeroTitle,
  HeroSubtitle,
  HeroButton,
  Features,
  Feature,
  FeatureIcon,
  FeatureTitle,
  FeatureDescription,
} from "./ShopPendingHome.styles";

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
