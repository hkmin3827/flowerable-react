import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { shopApi } from "@/features/shop/api";
import { COLOR_PALETTE } from "@/shared/constants/colors";

export const ShopWrappingPage = () => {
  const navigate = useNavigate();
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [price, setPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchWrappingOptions();
  }, []);

  const fetchWrappingOptions = async () => {
    setIsLoading(true);
    try {
      const response = await shopApi.getWrappingOptions();
      if (!response) {
        setSelectedColors([]);
        setPrice(0);
        alert("현재 등록된 정보가 없습니다. 포장 옵션을 등록해주세요");
        return;
      }
      setSelectedColors(response.colorNames);
      setPrice(response.price);
    } catch (error) {
      console.error("포장 옵션 조회 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleColor = (colorLabel: string) => {
    setSelectedColors((prev) =>
      prev.includes(colorLabel)
        ? prev.filter((c) => c !== colorLabel)
        : [...prev, colorLabel],
    );
  };
  const handleReset = () => {
    if (
      window.confirm("작성 중인 내용이 모두 사라집니다. 초기화하시겠습니까?")
    ) {
      window.location.reload();
    }
  };

  const handleSave = async () => {
    if (selectedColors.length === 0) {
      alert("최소 1개 이상의 색상을 선택해주세요.");
      return;
    }
    if (price < 0) {
      alert("가격은 0 이상이어야 합니다.");
      return;
    }

    setIsSaving(true);
    try {
      await shopApi.saveWrappingOptions({
        colorNames: selectedColors,
        price,
      });
      alert("포장 옵션이 저장되었습니다.");
    } catch (error) {
      console.error("포장 옵션 저장 실패:", error);
      alert("포장 옵션 저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Container>
        <LoadingContainer>
          <Spinner />
          <LoadingText>포장 옵션을 불러오는 중...</LoadingText>
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>포장지 관리</Title>
        <Subtitle>제공하는 포장지 색상과 가격을 설정하세요</Subtitle>
      </Header>

      <ContentCard>
        <Section>
          <SectionTitle>포장지 색상 선택</SectionTitle>
          <SectionDescription>
            제공 가능한 포장지 색상을 모두 선택해주세요
          </SectionDescription>

          <ColorPalette>
            {COLOR_PALETTE.map((color) => (
              <ColorWrapper key={color.value}>
                <ColorOption
                  $background={color.gradient ?? color.hex}
                  $selected={selectedColors.includes(color.label)}
                  onClick={() => toggleColor(color.label)}
                  title={color.label}
                >
                  {selectedColors.includes(color.label) && (
                    <CheckMark
                      $lightColor={
                        color.value === "WHITE" || color.value === "YELLOW"
                      }
                    >
                      ✓
                    </CheckMark>
                  )}
                </ColorOption>
                <ColorLabel>{color.label}</ColorLabel>
              </ColorWrapper>
            ))}
          </ColorPalette>

          <SelectedInfo>
            선택된 색상: {selectedColors.length}개 -{" "}
            {selectedColors.join(", ") || "없음"}
          </SelectedInfo>
        </Section>

        <Divider />

        <Section>
          <SectionTitle>포장 추가 가격</SectionTitle>
          <SectionDescription>
            포장에 대한 추가 비용을 설정하세요 (0원이면 무료)
          </SectionDescription>

          <PriceInputGroup>
            <PriceInput
              type="number"
              value={price}
              onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
              min={0}
            />
            <PriceUnit>원</PriceUnit>
          </PriceInputGroup>

          <PricePreview>
            고객이 포장 옵션 선택 시{" "}
            {price > 0 ? `${price.toLocaleString()}원` : "무료"}이 추가됩니다
          </PricePreview>
        </Section>

        <ButtonGroup>
          <ResetButton onClick={handleReset}>초기화</ResetButton>
          <SaveButton onClick={handleSave} disabled={isSaving}>
            {isSaving ? "저장 중..." : "저장하기"}
          </SaveButton>
        </ButtonGroup>
      </ContentCard>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  max-width: 800px;
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

const ContentCard = styled.div`
  background: white;
  border-radius: 0.5rem;
  padding: 2rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

const Section = styled.div`
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
`;

const SectionDescription = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1.5rem;
`;

const ColorPalette = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1.5rem;
  margin-bottom: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const ColorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const ColorOption = styled.button<{ $background?: string; $selected: boolean }>`
  width: 100%;
  aspect-ratio: 1;
  background: ${(props) => props.$background};
  border: 4px solid ${(props) => (props.$selected ? "#111827" : "#e5e7eb")};
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${(props) =>
    props.$selected ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)" : "none"};

  &:hover {
    transform: scale(1.05);
    border-color: ${(props) => (props.$selected ? "#111827" : "#d1d5db")};
  }
`;

const CheckMark = styled.span<{ $lightColor: boolean }>`
  font-size: 1.5rem;
  color: #111827;
  font-weight: 700;
  text-shadow: 0 0 2px white;
`;

const ColorLabel = styled.span`
  font-size: 0.875rem;
  color: #374151;
  font-weight: 500;
  text-align: center;
`;

const SelectedInfo = styled.div`
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #374151;
  border: 1px solid #e5e7eb;
`;

const Divider = styled.div`
  height: 1px;
  background-color: #e5e7eb;
  margin: 2rem 0;
`;

const PriceInputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  max-width: 300px;
  margin-bottom: 1rem;
`;

const PriceInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 600;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const PriceUnit = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
`;

const PricePreview = styled.div`
  padding: 1rem;
  background-color: #eff6ff;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #1e40af;
  border: 1px solid #dbeafe;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
`;

const ResetButton = styled.button`
  padding: 0.75rem 1.5rem;
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
const SaveButton = styled.button`
  padding: 0.75rem 1.5rem;
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
