import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { shopApi } from "@/features/shop/api";
import { MapPin, Phone, MessageCircle, ShoppingCart } from "lucide-react";
import { ShopDetailResponse } from "@/features/shop/types";
import { chatAPI } from "@/features/chat/api";
import { useAuthStore } from "@/features/auth/store";
import { colors, LoadingContainer } from "@/shared/ui/CommonStyles";

const Container = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const ShopCard = styled.div`
  background: ${colors.white};
  border-radius: 0.75rem;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const ShopName = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: ${colors.text};
  margin-bottom: 1rem;
`;

const Description = styled.p`
  color: ${colors.textSecondary};
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const InfoGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  color: ${colors.textSecondary};

  svg {
    flex-shrink: 0;
    margin-top: 0.25rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const ActionButton = styled.button<{ variant?: "primary" | "secondary" }>`
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
      box-shadow: 0 4px 6px -1px rgba(236, 72, 153, 0.3);
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

const FlowersSection = styled.div`
  background: ${colors.white};
  border-radius: 0.75rem;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${colors.text};
  margin-bottom: 1.5rem;
`;

const FlowerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FlowerCard = styled.div`
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

const FlowerName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${colors.text};
  margin-bottom: 0.75rem;
`;

const FlowerPrice = styled.p`
  font-size: 1.25rem;
  font-weight: bold;
  color: ${colors.primary};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: ${colors.textSecondary};
`;

const ShopDetailPage: React.FC = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [shop, setShop] = useState<ShopDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (shopId) {
      fetchShopDetail();
    }
  }, [shopId]);

  const fetchShopDetail = async () => {
    try {
      const response = await shopApi.getShopDetail(Number(shopId));
      setShop(response);
    } catch (error) {
      console.error("Failed to fetch shop detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = () => {
    if (!isAuthenticated) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    if (user?.role !== "ROLE_USER") {
      alert("사용자만 주문할 수 있습니다.");
      return;
    }

    navigate(`/order/${shopId}`);
  };

  const handleInquiry = async () => {
    if (!shopId) return;

    if (!isAuthenticated) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    try {
      const response = await chatAPI.getOrCreateChatRoom(Number(shopId));
      const chatRoomId = response.data;
      navigate("/chats");
    } catch (error) {
      console.error("Failed to create chat room:", error);
      alert("문의하기에 실패했습니다.");
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingContainer>로딩 중...</LoadingContainer>
      </Container>
    );
  }

  if (!shop) {
    return (
      <Container>
        <EmptyState>가게를 찾을 수 없습니다</EmptyState>
      </Container>
    );
  }

  const onSaleFlowers = shop.shopFlowers.filter((flower) => flower.onSale);

  return (
    <Container>
      <ShopCard>
        <ShopName>{shop.shopName}</ShopName>

        {shop.description && <Description>{shop.description}</Description>}

        <InfoGroup>
          <InfoItem>
            <MapPin size={20} />
            <span>{shop.address}</span>
          </InfoItem>
          <InfoItem>
            <Phone size={20} />
            <span>{shop.telnum}</span>
          </InfoItem>
        </InfoGroup>

        <ButtonGroup>
          <ActionButton variant="primary" onClick={handleOrder}>
            <ShoppingCart size={20} />
            주문하기
          </ActionButton>
          <ActionButton variant="secondary" onClick={handleInquiry}>
            <MessageCircle size={20} />
            문의하기
          </ActionButton>
        </ButtonGroup>
      </ShopCard>

      <FlowersSection>
        <SectionTitle>판매 중인 꽃</SectionTitle>
        {onSaleFlowers.length > 0 ? (
          <FlowerGrid>
            {onSaleFlowers.map((flower) => (
              <FlowerCard key={flower.id}>
                <FlowerName>{flower.flowerName}</FlowerName>
                <FlowerPrice>{flower.price.toLocaleString()}원</FlowerPrice>
              </FlowerCard>
            ))}
          </FlowerGrid>
        ) : (
          <EmptyState>판매 중인 꽃이 없습니다</EmptyState>
        )}
      </FlowersSection>
    </Container>
  );
};

export default ShopDetailPage;
