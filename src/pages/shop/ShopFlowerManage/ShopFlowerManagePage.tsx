import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { shopApi } from "@/features/shop/api";
import {
  ShopFlowerResponse,
  ShopFlowerUpdateRequest,
} from "@/features/shop/types";
import { Color } from "@/shared/types";
import { COLOR_PALETTE } from "@/shared/constants/colors";
import { extractErrorMessage } from "@/shared/utils/errorHandler";
import {
  Container,
  Header,
  TitleSection,
  Title,
  Subtitle,
  AddButton,
  FilterSection,
  FilterButton,
  FlowerGrid,
  FlowerCard,
  FlowerHeader,
  FlowerName,
  StatusBadge,
  FlowerPrice,
  ColorSection,
  ColorLabel,
  ColorList,
  ColorChip,
  ButtonGroup,
  EditButton,
  ToggleButton,
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
  ModalForm,
  FormGroup,
  Label,
  Input,
  ColorPalette,
  ColorOption,
  CheckMark,
  ModalButtonGroup,
  CancelButton,
  SubmitButton,
} from "./ShopFlowerManagePage.styles";

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
      alert(extractErrorMessage(error));
    }
  };

  const getColorHex = (color: Color): string => {
    return COLOR_PALETTE.find((c) => c.value === color)?.hex || "#49b7a8";
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
      alert(extractErrorMessage(error));
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
