import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { shopApi } from "@/features/shop/api";
import {
  ShopDetailResponse,
  ShopImageResponse,
  ShopUpdateRequest,
} from "@/features/shop/types";
import { ShopEditModal } from "@/features/shop/components/ShopEditModal";
import {
  Container,
  Section,
  SectionHeader,
  SectionTitle,
  MoreButton,
  ImageGrid,
  ImageCard,
  Image,
  EmptyImageText,
  MainContent,
  LeftSection,
  RightSection,
  ThumbnailSection,
  ThumbnailTitle,
  ThumbnailImage,
  PlaceholderBox,
  InfoCard,
  InfoHeader,
  InfoTitle,
  EditButton,
  InfoList,
  InfoItem,
  InfoLabel,
  InfoValue,
  ButtonGroup,
  ManageButton,
  ButtonIcon,
  LoadingContainer,
  Spinner,
  LoadingText,
  EmptyContainer,
  EmptyText,
} from "./ShopManagePage.styles";

export const ShopManagePage = () => {
  const navigate = useNavigate();
  const [shop, setShop] = useState<ShopDetailResponse | null>(null);
  const [latestImages, setLatestImages] = useState<ShopImageResponse[]>([]);
  const [thumbnail, setThumbnail] = useState<ShopImageResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchShopData();
  }, []);

  const fetchShopData = async () => {
    setIsLoading(true);
    try {
      const shopData = await shopApi.getMyShop();
      setShop(shopData);

      const images = await shopApi.getLatestImages(shopData.id);
      setLatestImages(images.slice(0, 5));

      const thumb = await shopApi.getThumbnail(shopData.id);
      setThumbnail(thumb);
    } catch (error) {
      console.error("샵 정보 조회 실패:", error);
      alert("샵 정보를 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateShop = async (data: ShopUpdateRequest) => {
    await shopApi.updateShop(data);
    await fetchShopData();
  };

  if (isLoading) {
    return (
      <Container>
        <LoadingContainer>
          <Spinner />
          <LoadingText>샵 정보를 불러오는 중...</LoadingText>
        </LoadingContainer>
      </Container>
    );
  }

  if (!shop) {
    return (
      <Container>
        <EmptyContainer>
          <EmptyText>샵 정보를 찾을 수 없습니다.</EmptyText>
        </EmptyContainer>
      </Container>
    );
  }

  return (
    <Container>
      {/* 최신 이미지 섹션 */}
      <Section>
        <SectionHeader>
          <SectionTitle>최신 샵 이미지</SectionTitle>
          <MoreButton onClick={() => navigate("/shop/images")}>
            더보기 →
          </MoreButton>
        </SectionHeader>
        <ImageGrid>
          {latestImages.length > 0 ? (
            latestImages.map((image) => (
              <ImageCard key={image.id}>
                <Image
                  src={image.imageUrl}
                  alt="샵 이미지"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/images/placeholder.jpg";
                  }}
                />
              </ImageCard>
            ))
          ) : (
            <EmptyImageText>등록된 이미지가 없습니다</EmptyImageText>
          )}
        </ImageGrid>
      </Section>

      {/* 샵 정보 섹션 */}
      <MainContent>
        <LeftSection>
          <ThumbnailSection>
            <ThumbnailTitle>대표 이미지</ThumbnailTitle>
            {thumbnail ? (
              <ThumbnailImage
                src={thumbnail.imageUrl}
                alt="대표 이미지"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/images/placeholder.jpg";
                }}
              />
            ) : (
              <PlaceholderBox>대표 이미지 없음</PlaceholderBox>
            )}
          </ThumbnailSection>
        </LeftSection>

        <RightSection>
          <InfoCard>
            <InfoHeader>
              <InfoTitle>샵 정보</InfoTitle>
              <EditButton onClick={() => setShowEditModal(true)}>
                수정하기
              </EditButton>
            </InfoHeader>

            <InfoList>
              <InfoItem>
                <InfoLabel>샵 이름</InfoLabel>
                <InfoValue>{shop.shopName}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>이메일</InfoLabel>
                <InfoValue>{shop.email}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>전화번호</InfoLabel>
                <InfoValue>{shop.telnum}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>주소</InfoLabel>
                <InfoValue>{shop.address}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>지역</InfoLabel>
                <InfoValue>
                  {shop.regionDesc} {shop.districtDesc}
                </InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>설명</InfoLabel>
                <InfoValue>{shop.description || "설명이 없습니다"}</InfoValue>
              </InfoItem>
            </InfoList>

            <ButtonGroup>
              <ManageButton onClick={() => navigate("/shop/flowers/manage")}>
                <ButtonIcon>🌸</ButtonIcon>
                보유 꽃 관리
              </ManageButton>
              <ManageButton onClick={() => navigate("/shop/wrapping")}>
                <ButtonIcon>🎁</ButtonIcon>
                포장지 관리
              </ManageButton>
            </ButtonGroup>
          </InfoCard>
        </RightSection>
      </MainContent>

      {showEditModal && (
        <ShopEditModal
          shop={shop}
          onClose={() => setShowEditModal(false)}
          onSave={handleUpdateShop}
        />
      )}
    </Container>
  );
};
