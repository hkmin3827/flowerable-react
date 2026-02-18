import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { shopApi } from "@/features/shop/api";
import { ShopImageResponse } from "@/features/shop/types";
import { uploadImageToS3 } from "@/shared/utils/s3Upload";
import { colors } from "@/shared/ui/CommonStyles";
import { ArrowLeft, Upload, Trash2, Star, StarOff, X } from "lucide-react";

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
      alert("이미지 업로드에 실패했습니다.");
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
      alert("이미지 삭제에 실패했습니다.");
    }
  };

  const handleSetThumbnail = async (imageId: number) => {
    try {
      await shopApi.setThumbnail(imageId);
      alert("대표 이미지로 설정되었습니다.");
      fetchImages();
    } catch (error) {
      console.error("Failed to set thumbnail:", error);
      alert("대표 이미지 설정에 실패했습니다.");
    }
  };

  const handleRemoveThumbnail = async (imageId: number) => {
    try {
      await shopApi.removeThumbnail(imageId);
      alert("대표 이미지가 해제되었습니다.");
      fetchImages();
    } catch (error) {
      console.error("Failed to remove thumbnail:", error);
      alert("대표 이미지 해제에 실패했습니다.");
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

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background: ${colors.white};
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const UploadButton = styled.label<{ disabled?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: ${(props) =>
    props.disabled ? colors.background : colors.primary};
  color: ${(props) => (props.disabled ? colors.textSecondary : colors.white)};
  border-radius: 0.5rem;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    background: ${(props) =>
      props.disabled ? colors.background : colors.primaryHover};
  }
`;

const ImageCount = styled.span`
  color: ${colors.textSecondary};
  font-size: 0.875rem;
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

const ImageActions = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem;
`;

const ActionButton = styled.button<{
  variant: "primary" | "secondary" | "danger";
}>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.5rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  ${({ variant }) => {
    switch (variant) {
      case "primary":
        return `
          background: ${colors.primary};
          color: ${colors.white};
          &:hover {
            background: ${colors.primaryHover};
          }
        `;
      case "secondary":
        return `
          background: ${colors.background};
          color: ${colors.text};
          &:hover {
            background: ${colors.border};
          }
        `;
      case "danger":
        return `
          background: ${colors.errorLight};
          color: ${colors.error};
          &:hover {
            background: ${colors.error};
            color: ${colors.white};
          }
        `;
    }
  }}
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

const EmptySubText = styled.p`
  font-size: 0.875rem;
  color: ${colors.textSecondary};
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
