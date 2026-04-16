import { useNavigate } from "react-router-dom";
import { useAIChatbotStore } from "@/features/ai-chatbot/store";
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
  AIChatbotFeature,
  NewBadge,
} from "./HomePage.styles";
import logo from "@/images/logos/flowerable로고배경제거.png";

export const HomePage = () => {
  const navigate = useNavigate();
  const { toggle: toggleChatbot } = useAIChatbotStore();

  return (
    <Container>
      <Hero>
        <HeroTitle>당신의 특별한 순간을 위한 꽃</HeroTitle>
        <HeroSubtitle>
          원하는 꽃을 선택하고, 가까운 꽃집에서 주문하세요
        </HeroSubtitle>
        <HeroButton onClick={() => navigate("/flowers")}>
          꽃 찾기 시작하기
        </HeroButton>
      </Hero>

      <Features>
        <AIChatbotFeature onClick={toggleChatbot}>
          <FeatureIcon>
            <img src={logo} alt="플라워러블 로고" />
          </FeatureIcon>
          <FeatureTitle>
            플라워러블 꽃 추천 챗봇
            <NewBadge>NEW</NewBadge>
          </FeatureTitle>
          <FeatureDescription>
            어떤 상황인지 알려주시면 어울리는 꽃과 가까운 꽃집을 찾아드려요
          </FeatureDescription>
        </AIChatbotFeature>

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
