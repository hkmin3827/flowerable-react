import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { shopApi } from "@/features/shop/api";
import { ShopImageResponse } from "@/features/shop/types";
import { colors } from "@/shared/ui/CommonStyles";
import { ArrowLeft, X, Star } from "lucide-react";

export const ShopImagesViewPage: React.FC = () => {
  const navigate = useNavigate();
  const { shopId } = useParams<{ shopId: string }>();

  const [images, setImages] = useState<ShopImageResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedImage, setSelectedImage] = useState<ShopImageResponse | null>(
    null,
  );

  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (shopId) {
      fetchImages();
    }
  }, [shopId]);

  const fetchImages = async (lastId?: number) => {
    if (!shopId) return;

    try {
      lastId ? setLoadingMore(true) : setLoading(true);

      const data = await shopApi.getShopImages(Number(shopId), lastId);

      if (data.length === 0) {
        setHasMore(false);
        return;
      }

      setImages((prev) => [...prev, ...data]);
    } catch (error) {
      console.error("Failed to fetch images:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const lastImageRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loadingMore || !hasMore) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && images.length > 0) {
          const lastId = images[images.length - 1].id;
          fetchImages(lastId);
        }
      });

      if (node) observer.current.observe(node);
    },
    [images, loadingMore, hasMore],
  );

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </BackButton>
        <PageTitle>샵 이미지</PageTitle>
      </Header>

      {loading ? (
        <LoadingContainer>
          <Spinner />
          <LoadingText>이미지를 불러오는 중...</LoadingText>
        </LoadingContainer>
      ) : images.length === 0 ? (
        <EmptyState>
          <EmptyText>등록된 이미지가 없습니다</EmptyText>
        </EmptyState>
      ) : (
        <ImageGrid>
          {images.map((image, index) => {
            if (index === images.length - 1) {
              return (
                <ImageCard key={image.id} ref={lastImageRef}>
                  <ImageWrapper onClick={() => setSelectedImage(image)}>
                    <Image src={image.imageUrl} alt="샵 이미지" />
                    {image.isThumbnail && (
                      <ThumbnailBadge>
                        <Star size={14} fill="currentColor" />
                        대표
                      </ThumbnailBadge>
                    )}
                  </ImageWrapper>
                </ImageCard>
              );
            }

            return (
              <ImageCard key={image.id}>
                <ImageWrapper onClick={() => setSelectedImage(image)}>
                  <Image src={image.imageUrl} alt="샵 이미지" />
                </ImageWrapper>
              </ImageCard>
            );
          })}
        </ImageGrid>
      )}

      {loadingMore && (
        <LoadingContainer>
          <Spinner />
        </LoadingContainer>
      )}

      {selectedImage && (
        <ImageModal onClick={() => setSelectedImage(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={() => setSelectedImage(null)}>
              <X size={24} />
            </CloseButton>
            <ModalImage src={selectedImage.imageUrl} />
          </ModalContent>
        </ImageModal>
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
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  padding: 0.5rem;
  border: none;
  background: transparent;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: ${colors.background};
  }
`;

const PageTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: bold;
  color: ${colors.text};
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const ImageCard = styled.div`
  background: ${colors.white};
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  cursor: pointer;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s;

  ${ImageWrapper}:hover & {
    transform: scale(1.05);
  }
`;

const ThumbnailBadge = styled.div`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.75rem;
  background: ${colors.primary};
  color: ${colors.white};
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const ImageDate = styled.div`
  padding: 0.75rem;
  border-top: 1px solid ${colors.border};
  font-size: 0.75rem;
  color: ${colors.textSecondary};
  text-align: center;
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
  border: 4px solid ${colors.background};
  border-top-color: ${colors.primary};
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
  color: ${colors.textSecondary};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 1rem;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const EmptyText = styled.p`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${colors.text};
  margin-bottom: 0.5rem;
`;

const ImageModal = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
`;

const ModalContent = styled.div`
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
`;

const CloseButton = styled.button`
  position: absolute;
  top: -3rem;
  right: 0;
  padding: 0.5rem;
  background: ${colors.white};
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: ${colors.background};
  }
`;

const ModalImage = styled.img`
  max-width: 100%;
  max-height: 85vh;
  object-fit: contain;
  border-radius: 0.5rem;
`;
