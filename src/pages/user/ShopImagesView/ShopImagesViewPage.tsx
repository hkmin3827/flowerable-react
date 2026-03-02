import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { shopApi } from "@/features/shop/api";
import { ShopImageResponse } from "@/features/shop/types";
import { ArrowLeft, X, Star } from "lucide-react";
import {
  Container,
  Header,
  BackButton,
  PageTitle,
  ImageGrid,
  ImageCard,
  ImageWrapper,
  Image,
  ThumbnailBadge,
  LoadingContainer,
  Spinner,
  LoadingText,
  EmptyState,
  EmptyText,
  ImageModal,
  ModalContent,
  CloseButton,
  ModalImage,
} from "./ShopImagesViewPage.styles";

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
