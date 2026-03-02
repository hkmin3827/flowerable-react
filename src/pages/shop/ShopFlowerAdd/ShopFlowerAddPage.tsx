import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { flowerApi } from "@/features/search/api";
import { shopApi } from "@/features/shop/api";
import { Flower } from "@/features/search/types";
import { Season, Color } from "@/shared/types";
import { COLOR_PALETTE } from "@/shared/constants/colors";
import { extractErrorMessage } from "@/shared/utils/errorHandler";
import {
  Container,
  Header,
  BackButton,
  TitleSection,
  Title,
  Subtitle,
  CategoryFilter,
  CategoryButton,
  FlowerGrid,
  FlowerCard,
  FlowerImage,
  FlowerInfo,
  FlowerName,
  FlowerLang,
  CategoryBadge,
  LoadingContainer,
  Spinner,
  LoadingText,
  EmptyContainer,
  EmptyText,
  Pagination,
  PageButton,
  PageInfo,
  Overlay,
  Modal,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalContent,
  FlowerPreview,
  PreviewImage,
  PreviewInfo,
  PreviewName,
  PreviewLang,
  ModalForm,
  FormGroup,
  Label,
  Input,
  ColorPalette,
  ColorOption,
  CheckMark,
  HelperText,
  ModalButtonGroup,
  CancelButton,
  SubmitButton,
} from "./ShopFlowerAddPage.styles";

export const ShopFlowerAddPage = () => {
  const navigate = useNavigate();
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Season | undefined>(
    undefined,
  );
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFlower, setSelectedFlower] = useState<Flower | null>(null);
  const [showOptionModal, setShowOptionModal] = useState(false);

  const categories: { value: Season | undefined; label: string }[] = [
    { value: undefined, label: "전체" },
    { value: "SPRING", label: "봄" },
    { value: "SUMMER", label: "여름" },
    { value: "AUTUMN", label: "가을" },
    { value: "WINTER", label: "겨울" },
  ];

  useEffect(() => {
    fetchFlowers();
  }, [selectedCategory, currentPage]);

  const fetchFlowers = async () => {
    setIsLoading(true);
    try {
      const response = await flowerApi.getFlowers(
        selectedCategory,
        currentPage,
        12,
      );
      setFlowers(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("꽃 목록 조회 실패:", error);
      alert("꽃 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (category: Season | undefined) => {
    setSelectedCategory(category);
    setCurrentPage(0);
  };

  const handleFlowerClick = (flower: Flower) => {
    setSelectedFlower(flower);
    setShowOptionModal(true);
  };

  const getCategoryLabel = (category: Season): string => {
    const labels: Record<Season, string> = {
      SPRING: "봄",
      SUMMER: "여름",
      AUTUMN: "가을",
      WINTER: "겨울",
    };
    return labels[category] || category;
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate("/shop/flowers/manage")}>
          ← 돌아가기
        </BackButton>
        <TitleSection>
          <Title>꽃 추가하기</Title>
          <Subtitle>판매할 꽃을 선택하고 옵션을 설정하세요</Subtitle>
        </TitleSection>
      </Header>

      <CategoryFilter>
        {categories.map((category) => (
          <CategoryButton
            key={category.label}
            $active={selectedCategory === category.value}
            onClick={() => handleCategoryChange(category.value)}
          >
            {category.label}
          </CategoryButton>
        ))}
      </CategoryFilter>

      {isLoading ? (
        <LoadingContainer>
          <Spinner />
          <LoadingText>꽃 목록을 불러오는 중...</LoadingText>
        </LoadingContainer>
      ) : flowers.length === 0 ? (
        <EmptyContainer>
          <EmptyText>등록된 꽃이 없습니다.</EmptyText>
        </EmptyContainer>
      ) : (
        <>
          <FlowerGrid>
            {flowers.map((flower) => (
              <FlowerCard
                key={flower.id}
                onClick={() => handleFlowerClick(flower)}
              >
                <FlowerImage
                  src={flower.imageUrl}
                  alt={flower.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/images/placeholder-flower.jpg";
                  }}
                />
                <FlowerInfo>
                  <FlowerName>{flower.name}</FlowerName>
                  <FlowerLang>{flower.floralLang}</FlowerLang>
                  <CategoryBadge>
                    {getCategoryLabel(flower.category)}
                  </CategoryBadge>
                </FlowerInfo>
              </FlowerCard>
            ))}
          </FlowerGrid>

          {totalPages > 1 && (
            <Pagination>
              <PageButton
                onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
              >
                이전
              </PageButton>
              <PageInfo>
                {currentPage + 1} / {totalPages}
              </PageInfo>
              <PageButton
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
                }
                disabled={currentPage === totalPages - 1}
              >
                다음
              </PageButton>
            </Pagination>
          )}
        </>
      )}

      {showOptionModal && selectedFlower && (
        <FlowerOptionModal
          flower={selectedFlower}
          onClose={() => {
            setShowOptionModal(false);
            setSelectedFlower(null);
          }}
          onRegister={async (data) => {
            await shopApi.registerShopFlower(data);
            navigate("/shop/flowers/manage");
          }}
        />
      )}
    </Container>
  );
};

interface FlowerOptionModalProps {
  flower: Flower;
  onClose: () => void;
  onRegister: (data: {
    flowerId: number;
    colors: Color[];
    price: number;
  }) => Promise<void>;
}

const FlowerOptionModal = ({
  flower,
  onClose,
  onRegister,
}: FlowerOptionModalProps) => {
  const [price, setPrice] = useState<number>(0);
  const [selectedColors, setSelectedColors] = useState<Color[]>([]);
  const [isRegistering, setIsRegistering] = useState(false);

  const toggleColor = (color: Color) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedColors.length === 0) {
      alert("최소 1개 이상의 색상을 선택해주세요.");
      return;
    }
    if (price <= 0) {
      alert("가격은 0보다 커야 합니다.");
      return;
    }

    setIsRegistering(true);
    try {
      await onRegister({
        flowerId: flower.id,
        colors: selectedColors,
        price,
      });
    } catch (error) {
      console.error("꽃 등록 실패:", error);
      alert(extractErrorMessage(error));
      setIsRegistering(false);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{flower.name} 등록</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <ModalContent>
          <FlowerPreview>
            <PreviewImage
              src={flower.imageUrl}
              alt={flower.name}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "/images/placeholder-flower.jpg";
              }}
            />
            <PreviewInfo>
              <PreviewName>{flower.name}</PreviewName>
              <PreviewLang>{flower.floralLang}</PreviewLang>
            </PreviewInfo>
          </FlowerPreview>

          <ModalForm onSubmit={handleSubmit}>
            <FormGroup>
              <Label>판매 가격 (원)</Label>
              <Input
                type="number"
                value={price || ""}
                onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
                placeholder="가격을 입력하세요"
                min={1}
              />
            </FormGroup>

            <FormGroup>
              <Label>보유 색상 선택</Label>
              <ColorPalette>
                {COLOR_PALETTE.map((color) => (
                  <ColorOption
                    key={color.value}
                    type="button"
                    $background={color.gradient ?? color.hex}
                    $selected={selectedColors.includes(color.value)}
                    onClick={() => toggleColor(color.value)}
                    title={color.label}
                  >
                    {selectedColors.includes(color.value) && (
                      <CheckMark>✓</CheckMark>
                    )}
                  </ColorOption>
                ))}
              </ColorPalette>
              <HelperText>선택된 색상: {selectedColors.length}개</HelperText>
            </FormGroup>

            <ModalButtonGroup>
              <CancelButton type="button" onClick={onClose}>
                취소
              </CancelButton>
              <SubmitButton type="submit" disabled={isRegistering}>
                {isRegistering ? "등록 중..." : "등록하기"}
              </SubmitButton>
            </ModalButtonGroup>
          </ModalForm>
        </ModalContent>
      </Modal>
    </Overlay>
  );
};
