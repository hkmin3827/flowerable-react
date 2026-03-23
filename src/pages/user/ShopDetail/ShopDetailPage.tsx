import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { shopApi } from "@/features/shop/api";
import { MapPin, Phone, MessageCircle, ShoppingCart } from "lucide-react";
import { ShopDetailResponse, ShopImageResponse } from "@/features/shop/types";
import { chatAPI } from "@/features/chat/api";
import { useAuthStore } from "@/features/auth/store";
import { LoadingContainer } from "@/shared/ui/CommonStyles";
import { ChatRoomListRes } from "@/features/chat/types";
import ChatRoomModal from "@/features/chat/components/ChatRoomModal";
import DefaultShopThumbnail from "@/images/DefaultShopImageThumbnail.png";
import { extractErrorMessage } from "@/shared/utils/errorHandler";
import {
  Container,
  ShopCard,
  ShopName,
  Description,
  InfoGroup,
  InfoItem,
  ButtonGroup,
  ActionButton,
  FlowersSection,
  SectionTitle,
  FlowerGrid,
  FlowerCard,
  FlowerName,
  FlowerPrice,
  EmptyState,
  ThumbnailWrapper,
  ThumbnailImage,
  ImageSection,
  ImageHeader,
  ImageGrid,
  ImageCard,
  MoreButton,
} from "./ShopDetailPage.styles";

const ShopDetailPage: React.FC = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [shop, setShop] = useState<ShopDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [chatRoom, setChatRoom] = useState<ChatRoomListRes | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [thumbnail, setThumbnail] = useState<ShopImageResponse | null>(null);
  const [latestImages, setLatestImages] = useState<ShopImageResponse[]>([]);
  const representativeImage =
    thumbnail?.imageUrl && thumbnail.imageUrl.trim() !== ""
      ? thumbnail.imageUrl
      : DefaultShopThumbnail;

  useEffect(() => {
    if (shopId) {
      fetchShopDetail();
    }
  }, [shopId]);

  const fetchShopDetail = async () => {
    try {
      const response = await shopApi.getShopDetail(Number(shopId));
      setShop(response);

      const thumb = await shopApi.getThumbnail(Number(shopId));
      setThumbnail(thumb);

      const images = await shopApi.getLatestImages(Number(shopId));
      setLatestImages(images);
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
    if (!shopId || !shop) return;

    if (!isAuthenticated) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    try {
      const res = await chatAPI.enterChatRoom(Number(shopId));

      const chatRoomData: ChatRoomListRes = {
        ...res.data,
        opponentName: shop!.shopName,
        lastMessage: "",
        lastMessageAt: new Date().toISOString(),
        unreadCount: 0,
      };

      setChatRoom(chatRoomData);

      setChatOpen(true);
    } catch (error) {
      console.error("Failed to open chat:", error);
      alert(extractErrorMessage(error));
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
    <>
      <Container>
        <ShopCard>
          {/* 최신 이미지 */}
          <ImageSection>
            <ImageHeader>
              <MoreButton onClick={() => navigate(`/shop-images/${shopId}`)}>
                사진 더보기 →
              </MoreButton>
            </ImageHeader>

            <ImageGrid>
              {latestImages.length > 0 ? (
                latestImages.map((img) => (
                  <ImageCard key={img.id}>
                    <img
                      src={img.imageUrl}
                      alt="샵 이미지"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          DefaultShopThumbnail;
                      }}
                    />
                  </ImageCard>
                ))
              ) : (
                <EmptyState>등록된 이미지가 없습니다</EmptyState>
              )}
            </ImageGrid>
            <ThumbnailWrapper>
              <ThumbnailImage
                src={representativeImage}
                alt="샵 대표 이미지"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = DefaultShopThumbnail;
                }}
              />
            </ThumbnailWrapper>
          </ImageSection>

          <ShopName>{shop.shopName}</ShopName>

          {shop.description && <Description>{shop.description}</Description>}

          <InfoGroup>
            <InfoItem>
              <MapPin size={20} />
              <span>
                {shop.regionDesc} {shop.districtDesc} {shop.address}
              </span>
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
      {chatOpen && chatRoom && (
        <ChatRoomModal
          chatRoom={chatRoom}
          userType={user?.role ?? ""}
          onClose={() => setChatOpen(false)}
        />
      )}
    </>
  );
};

export default ShopDetailPage;
