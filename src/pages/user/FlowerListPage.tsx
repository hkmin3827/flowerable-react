import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { flowerApi } from "@/features/flower/api";
import { Flower } from "@/features/flower/types";
import { Season } from "@/shared/types";

export const FlowerListPage = () => {
  const navigate = useNavigate();
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
    navigate(`/shops?flower=${encodeURIComponent(flower.name)}`);
  };

  return (
    <Container>
      <Header>
        <Title>꽃 찾기</Title>
        <Subtitle>
          원하시는 꽃을 선택하면 해당 꽃을 판매하는 꽃집을 찾아드립니다
        </Subtitle>
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
    </Container>
  );
};

const getCategoryLabel = (category: Season): string => {
  const labels: Record<Season, string> = {
    SPRING: "봄",
    SUMMER: "여름",
    FALL: "가을",
    WINTER: "겨울",
    ALL: "사계절",
  };
  return labels[category] || category;
};

const Container = styled.div`
  max-width: 1200px;
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
  height: 200px;
  object-fit: cover;
`;

const FlowerInfo = styled.div`
  padding: 1rem;
`;

const FlowerName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.25rem;
`;

const FlowerLang = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
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
