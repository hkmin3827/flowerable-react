import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { shopApi } from "@/features/shop/api";
import {
  ShopFlowerResponse,
  ShopFlowerUpdateRequest,
} from "@/features/shop/types";
import { Color } from "@/shared/types";
import { COLOR_PALETTE } from "@/shared/constants/colors";

export const ShopFlowerManagePage = () => {
  const navigate = useNavigate();
  const [shopFlowers, setShopFlowers] = useState<ShopFlowerResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [onSaleFilter, setOnSaleFilter] = useState<boolean | undefined>(
    undefined,
  );
  const [editingFlower, setEditingFlower] = useState<ShopFlowerResponse | null>(
    null,
  );
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchShopFlowers();
  }, [currentPage, onSaleFilter]);

  const fetchShopFlowers = async () => {
    setIsLoading(true);
    try {
      const response = await shopApi.getMyShopFlowers(
        onSaleFilter,
        currentPage,
        12,
      );
      setShopFlowers(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("보유 꽃 목록 조회 실패:", error);
      alert("보유 꽃 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (flower: ShopFlowerResponse) => {
    setEditingFlower(flower);
    setShowEditModal(true);
  };

  const handleToggleSale = async (flower: ShopFlowerResponse) => {
    try {
      if (flower.onSale) {
        await shopApi.deactivateShopFlower(flower.id);
      } else {
        await shopApi.activateShopFlower(flower.id);
      }
      await fetchShopFlowers();
    } catch (error) {
      console.error("판매 상태 변경 실패:", error);
      alert("판매 상태 변경에 실패했습니다.");
    }
  };

  const getColorHex = (color: Color): string => {
    return COLOR_PALETTE.find((c) => c.value === color)?.hex || "#6b7280";
  };

  const getColorLabel = (color: Color): string => {
    return COLOR_PALETTE.find((c) => c.value === color)?.label || color;
  };

  return (
    <Container>
      <Header>
        <TitleSection>
          <Title>보유 꽃 관리</Title>
          <Subtitle>
            등록한 꽃을 관리하고 판매 상태를 변경할 수 있습니다
          </Subtitle>
        </TitleSection>
        <AddButton onClick={() => navigate("/shop/flowers/add")}>
          + 꽃 추가하기
        </AddButton>
      </Header>

      <FilterSection>
        <FilterButton
          $active={onSaleFilter === undefined}
          onClick={() => setOnSaleFilter(undefined)}
        >
          전체
        </FilterButton>
        <FilterButton
          $active={onSaleFilter === true}
          onClick={() => setOnSaleFilter(true)}
        >
          판매중
        </FilterButton>
        <FilterButton
          $active={onSaleFilter === false}
          onClick={() => setOnSaleFilter(false)}
        >
          판매중지
        </FilterButton>
      </FilterSection>

      {isLoading ? (
        <LoadingContainer>
          <Spinner />
          <LoadingText>목록을 불러오는 중...</LoadingText>
        </LoadingContainer>
      ) : shopFlowers.length === 0 ? (
        <EmptyContainer>
          <EmptyText>등록된 꽃이 없습니다.</EmptyText>
          <AddButton onClick={() => navigate("/shop/flowers/add")}>
            꽃 추가하기
          </AddButton>
        </EmptyContainer>
      ) : (
        <>
          <FlowerGrid>
            {shopFlowers.map((flower) => (
              <FlowerCard key={flower.id}>
                <FlowerHeader>
                  <FlowerName>{flower.flowerName}</FlowerName>
                  <StatusBadge $active={flower.onSale}>
                    {flower.onSale ? "판매중" : "판매중지"}
                  </StatusBadge>
                </FlowerHeader>

                <FlowerPrice>{flower.price.toLocaleString()}원</FlowerPrice>

                <ColorSection>
                  <ColorLabel>보유 색상</ColorLabel>
                  <ColorList>
                    {flower.colors.map((color) => (
                      <ColorChip
                        key={color}
                        $color={getColorHex(color)}
                        title={getColorLabel(color)}
                      >
                        {getColorLabel(color)}
                      </ColorChip>
                    ))}
                  </ColorList>
                </ColorSection>

                <ButtonGroup>
                  <EditButton onClick={() => handleEdit(flower)}>
                    수정
                  </EditButton>
                  <ToggleButton
                    $active={flower.onSale}
                    onClick={() => handleToggleSale(flower)}
                  >
                    {flower.onSale ? "판매중지" : "판매시작"}
                  </ToggleButton>
                </ButtonGroup>
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

      {showEditModal && editingFlower && (
        <EditFlowerModal
          flower={editingFlower}
          onClose={() => {
            setShowEditModal(false);
            setEditingFlower(null);
          }}
          onSave={async (data) => {
            await shopApi.updateShopFlower(editingFlower.id, data);
            await fetchShopFlowers();
            setShowEditModal(false);
            setEditingFlower(null);
          }}
        />
      )}
    </Container>
  );
};

// 꽃 수정 모달 컴포넌트
interface EditFlowerModalProps {
  flower: ShopFlowerResponse;
  onClose: () => void;
  onSave: (data: ShopFlowerUpdateRequest) => Promise<void>;
}

const EditFlowerModal = ({ flower, onClose, onSave }: EditFlowerModalProps) => {
  const [price, setPrice] = useState(flower.price);
  const [selectedColors, setSelectedColors] = useState<Color[]>(flower.colors);
  const [isSaving, setIsSaving] = useState(false);

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

    setIsSaving(true);
    try {
      await onSave({ price, colors: selectedColors });
    } catch (error) {
      console.error("꽃 정보 수정 실패:", error);
      alert("꽃 정보 수정에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{flower.flowerName} 수정</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <ModalForm onSubmit={handleSubmit}>
          <FormGroup>
            <Label>가격 (원)</Label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(parseInt(e.target.value))}
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
          </FormGroup>

          <ModalButtonGroup>
            <CancelButton type="button" onClick={onClose}>
              취소
            </CancelButton>
            <SubmitButton type="submit" disabled={isSaving}>
              {isSaving ? "저장 중..." : "저장"}
            </SubmitButton>
          </ModalButtonGroup>
        </ModalForm>
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
`;

const TitleSection = styled.div``;

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

const AddButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    background-color: #2563eb;
  }
`;

const FilterSection = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1.25rem;
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
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const FlowerCard = styled.div`
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
`;

const FlowerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const FlowerName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
`;

const StatusBadge = styled.span<{ $active: boolean }>`
  padding: 0.25rem 0.75rem;
  background-color: ${(props) => (props.$active ? "#dcfce7" : "#fee2e2")};
  color: ${(props) => (props.$active ? "#16a34a" : "#dc2626")};
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const FlowerPrice = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 1rem;
`;

const ColorSection = styled.div`
  margin-bottom: 1rem;
`;

const ColorLabel = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const ColorList = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const ColorChip = styled.span<{ $color: string }>`
  padding: 0.25rem 0.75rem;
  background-color: ${(props) =>
    props.$color.toLowerCase() === "#ffffff" ? "#ffffff" : `${props.$color}20`};

  color: ${(props) =>
    props.$color.toLowerCase() === "#ffffff" ? "#666" : props.$color};

  border: 1px solid
    ${(props) =>
      props.$color.toLowerCase() === "#ffffff" ? "#666" : props.$color};
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const ButtonGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const EditButton = styled.button`
  padding: 0.5rem;
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

const ToggleButton = styled.button<{ $active: boolean }>`
  padding: 0.5rem;
  background-color: ${(props) => (props.$active ? "#fee2e2" : "#dcfce7")};
  color: ${(props) => (props.$active ? "#dc2626" : "#16a34a")};
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    opacity: 0.8;
  }
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
  margin-bottom: 1.5rem;
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
  max-width: 500px;
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

const ModalForm = styled.form`
  padding: 1.5rem;
`;

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
