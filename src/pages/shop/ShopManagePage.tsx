import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { shopApi } from "@/features/shop/api";
import {
  ShopDetailResponse,
  ShopImageResponse,
  ShopUpdateRequest,
} from "@/features/shop/types";
import { ShopEditModal } from "@/features/shop/components/ShopEditModal";
import { useAuthStore } from "@/features/auth/store";

export const ShopManagePage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
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

      // 최신 이미지 조회
      const images = await shopApi.getLatestImages(shopData.id);
      setLatestImages(images.slice(0, 5));

      // 대표 이미지 조회
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

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Header = styled.div`
  margin-bottom: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #6b7280;
  font-size: 1rem;
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
`;

const MoreButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #e5e7eb;
  }
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ImageCard = styled.div`
  aspect-ratio: 1;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const EmptyImageText = styled.p`
  grid-column: 1 / -1;
  text-align: center;
  color: #6b7280;
  padding: 2rem 0;
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const LeftSection = styled.div``;

const RightSection = styled.div``;

const ThumbnailSection = styled.div`
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

const ThumbnailTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1rem;
`;

const ThumbnailImage = styled.img`
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 0.375rem;
`;

const PlaceholderBox = styled.div`
  width: 100%;
  aspect-ratio: 1;
  background-color: #f3f4f6;
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 0.875rem;
`;

const InfoCard = styled.div`
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

const InfoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
`;

const InfoTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
`;

const EditButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #2563eb;
  }
`;

const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const InfoLabel = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
`;

const InfoValue = styled.div`
  font-size: 0.875rem;
  color: #111827;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
`;

const ManageButton = styled.button`
  padding: 0.875rem 1rem;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: #f3f4f6;
    border-color: #d1d5db;
  }
`;

const ButtonIcon = styled.span`
  font-size: 1.25rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid #f3f4f6;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  margin-top: 1rem;
  color: #6b7280;
`;

const EmptyContainer = styled.div`
  text-align: center;
  padding: 4rem 0;
`;

const EmptyText = styled.p`
  color: #6b7280;
  font-size: 1.125rem;
`;
