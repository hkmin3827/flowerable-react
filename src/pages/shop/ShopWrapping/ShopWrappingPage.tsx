import { useState, useEffect } from "react";
import { shopApi } from "@/features/shop/api";
import { COLOR_PALETTE } from "@/shared/constants/colors";
import { extractErrorMessage } from "@/shared/utils/errorHandler";
import {
  Container,
  Header,
  Title,
  Subtitle,
  ContentCard,
  Section,
  SectionTitle,
  SectionDescription,
  ColorPalette,
  ColorWrapper,
  ColorOption,
  CheckMark,
  ColorLabel,
  SelectedInfo,
  Divider,
  PriceInputGroup,
  PriceInput,
  PriceUnit,
  PricePreview,
  ButtonGroup,
  ResetButton,
  SaveButton,
  LoadingContainer,
  Spinner,
  LoadingText,
} from "./ShopWrappingPage.styles";

export const ShopWrappingPage = () => {
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
      alert(extractErrorMessage(error));
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
