import { useState, useEffect } from "react";
import { flowerApi } from "@/features/search/api";
import { Flower } from "@/features/search/types";
import { Season } from "@/shared/types";
import {
  Container,
  Header,
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
} from "./ShopFlowersViewPage.styles";

export const ShopFlowersViewPage = () => {
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Season | undefined>(
    undefined,
  );
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

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
        <Title>꽃 조회</Title>
        <Subtitle>등록 가능한 꽃 목록입니다</Subtitle>
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
              <FlowerCard key={flower.id}>
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
    </Container>
  );
};
