import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { shopApi } from "@/features/shop/api";
import { ShopImageResponse } from "@/features/shop/types";
import { uploadImageToS3 } from "@/shared/utils/s3Upload";
import { ArrowLeft, Upload, Trash2, Star, StarOff, X } from "lucide-react";
import { extractErrorMessage } from "@/shared/utils/errorHandler";
import {
  Container,
  Header,
  BackButton,
  PageTitle,
  ActionBar,
  UploadButton,
  ImageCount,
  ImageGrid,
  ImageCard,
  ImageWrapper,
  Image,
  ThumbnailBadge,
  ImageActions,
  ActionButton,
  ImageDate,
  LoadingContainer,
  Spinner,
  LoadingText,
  EmptyState,
  EmptyIcon,
  EmptyText,
  EmptySubText,
  ImageModal,
  ModalContent,
  CloseButton,
  ModalImage,
} from "./ShopImagesPage.styles";

export const ShopImagesPage: React.FC = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<ShopImageResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ShopImageResponse | null>(
    null,
  );

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const data = await shopApi.getMyShopImages();
      setImages(data);
    } catch (error) {
      console.error("Failed to fetch images:", error);
      alert("이미지 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map((file) =>
        uploadImageToS3(file, "shop-images"),
      );

      const imageUrls = await Promise.all(uploadPromises);

      // 서버에 이미지 URL 저장
      await shopApi.uploadImages(imageUrls);

      alert(`${files.length}개의 이미지가 업로드되었습니다!`);
      fetchImages();
    } catch (error) {
      console.error("Failed to upload images:", error);
      alert(extractErrorMessage(error));
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!window.confirm("이 이미지를 삭제하시겠습니까?")) return;

    try {
      await shopApi.deleteImage(imageId);
      alert("이미지가 삭제되었습니다.");
      fetchImages();
    } catch (error) {
      console.error("Failed to delete image:", error);
      alert(extractErrorMessage(error));
    }
  };

  const handleSetThumbnail = async (imageId: number) => {
    try {
      await shopApi.setThumbnail(imageId);
      alert("대표 이미지로 설정되었습니다.");
      fetchImages();
    } catch (error) {
      console.error("Failed to set thumbnail:", error);
      alert(extractErrorMessage(error));
    }
  };

  const handleRemoveThumbnail = async (imageId: number) => {
    try {
      await shopApi.removeThumbnail(imageId);
      alert("대표 이미지가 해제되었습니다.");
      fetchImages();
    } catch (error) {
      console.error("Failed to remove thumbnail:", error);
      alert(extractErrorMessage(error));
    }
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate("/shop/manage")}>
          <ArrowLeft size={24} />
        </BackButton>
        <PageTitle>샵 이미지 관리</PageTitle>
      </Header>

      <ActionBar>
        <UploadButton htmlFor="image-upload" disabled={uploading}>
          <Upload size={20} />
          {uploading ? "업로드 중..." : "이미지 업로드"}
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            disabled={uploading}
            style={{ display: "none" }}
          />
        </UploadButton>
        <ImageCount>총 {images.length}개의 이미지</ImageCount>
      </ActionBar>

      {loading ? (
        <LoadingContainer>
          <Spinner />
          <LoadingText>이미지를 불러오는 중...</LoadingText>
        </LoadingContainer>
      ) : images.length === 0 ? (
        <EmptyState>
          <EmptyIcon>📷</EmptyIcon>
          <EmptyText>등록된 이미지가 없습니다</EmptyText>
          <EmptySubText>위의 버튼을 눌러 이미지를 업로드해주세요</EmptySubText>
        </EmptyState>
      ) : (
        <ImageGrid>
          {images.map((image) => (
            <ImageCard key={image.id}>
              <ImageWrapper onClick={() => setSelectedImage(image)}>
                <Image
                  src={image.imageUrl}
                  alt="샵 이미지"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/images/placeholder.jpg";
                  }}
                />
                {image.isThumbnail && (
                  <ThumbnailBadge>
                    <Star size={16} fill="currentColor" />
                    대표 이미지
                  </ThumbnailBadge>
                )}
              </ImageWrapper>

              <ImageActions>
                {image.isThumbnail ? (
                  <ActionButton
                    onClick={() => handleRemoveThumbnail(image.id)}
                    variant="secondary"
                  >
                    <StarOff size={16} />
                    대표 해제
                  </ActionButton>
                ) : (
                  <ActionButton
                    onClick={() => handleSetThumbnail(image.id)}
                    variant="primary"
                  >
                    <Star size={16} />
                    대표 설정
                  </ActionButton>
                )}
                <ActionButton
                  onClick={() => handleDeleteImage(image.id)}
                  variant="danger"
                >
                  <Trash2 size={16} />
                  삭제
                </ActionButton>
              </ImageActions>

              <ImageDate>
                {new Date(image.createdAt).toLocaleDateString()}
              </ImageDate>
            </ImageCard>
          ))}
        </ImageGrid>
      )}

      {selectedImage && (
        <ImageModal onClick={() => setSelectedImage(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={() => setSelectedImage(null)}>
              <X size={24} />
            </CloseButton>
            <ModalImage
              src={selectedImage.imageUrl}
              alt="확대 이미지"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
              }}
            />
          </ModalContent>
        </ImageModal>
      )}
    </Container>
  );
};
