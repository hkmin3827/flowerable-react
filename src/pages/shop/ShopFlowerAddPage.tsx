import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { flowerApi } from "@/features/search/api";
import { shopApi } from "@/features/shop/api";
import { Flower } from "@/features/search/types";
import { Season, Color } from "@/shared/types";
import { COLOR_PALETTE } from "@/shared/constants/colors";

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

// 꽃 옵션 선택 모달
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
      alert("꽃 등록에 실패했습니다.");
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
                    $color={color.hex}
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

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 1rem;

  &:hover {
    background-color: #e5e7eb;
  }
`;

const TitleSection = styled.div`
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

const CategoryFilter = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const CategoryButton = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1.5rem;
  border: 1px solid ${(props) => (props.$active ? "#3b82f6" : "#d1d5db")};
  background-color: ${(props) => (props.$active ? "#3b82f6" : "white")};
  color: ${(props) => (props.$active ? "white" : "#374151")};
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${(props) => (props.$active ? "#2563eb" : "#f3f4f6")};
  }
`;

const FlowerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const FlowerCard = styled.div`
  background: white;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
`;

const FlowerImage = styled.img`
  width: 100%;
  height: 250px;
  object-fit: cover;
`;

const FlowerInfo = styled.div`
  padding: 1rem;
`;

const FlowerName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
`;

const FlowerLang = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.75rem;
`;

const CategoryBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background-color: #eff6ff;
  color: #3b82f6;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
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

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
`;

const PageButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: #f3f4f6;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PageInfo = styled.span`
  color: #374151;
  font-size: 0.875rem;
`;

// Modal Styles
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: white;
  border-radius: 0.5rem;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 2rem;
  color: #6b7280;
  cursor: pointer;
  padding: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #111827;
  }
`;

const ModalContent = styled.div`
  padding: 1.5rem;
`;

const FlowerPreview = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
`;

const PreviewImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 0.5rem;
`;

const PreviewInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const PreviewName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.25rem;
`;

const PreviewLang = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
`;

const ModalForm = styled.form``;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ColorPalette = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.75rem;
  margin-bottom: 0.5rem;
`;

const ColorOption = styled.button<{ $color: string; $selected: boolean }>`
  aspect-ratio: 1;
  background-color: ${(props) => props.$color};
  border: 3px solid ${(props) => (props.$selected ? "#111827" : "#e5e7eb")};
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: scale(1.1);
    border-color: ${(props) => (props.$selected ? "#111827" : "#d1d5db")};
  }
`;

const CheckMark = styled.span`
  font-size: 1.5rem;
  color: #111827;
  font-weight: 700;
  text-shadow: 0 0 2px white;
`;

const HelperText = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
`;

const ModalButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const CancelButton = styled.button`
  padding: 0.625rem 1.5rem;
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

const SubmitButton = styled.button`
  padding: 0.625rem 1.5rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: #2563eb;
  }

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
`;
