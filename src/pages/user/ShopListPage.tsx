import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { flowerApi } from "@/features/flower/api";
import { Shop, Region, District } from "@/features/flower/types";

export const ShopListPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const flowerName = searchParams.get("flower") || "";

  const [shops, setShops] = useState<Shop[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);

  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchRegions();
  }, []);

  useEffect(() => {
    if (selectedRegion) {
      fetchDistricts(selectedRegion);
    } else {
      setDistricts([]);
      setSelectedDistrict("");
    }
  }, [selectedRegion]);

  useEffect(() => {
    if (flowerName) {
      fetchShops();
    }
  }, [flowerName, selectedRegion, selectedDistrict, currentPage]);

  const fetchRegions = async () => {
    try {
      const response = await flowerApi.getRegions();
      setRegions(response);
    } catch (error) {
      console.error("지역 목록 조회 실패:", error);
    }
  };

  const fetchDistricts = async (region: string) => {
    try {
      const response = await flowerApi.getDistricts(region);
      setDistricts(response);
    } catch (error) {
      console.error("구/군 목록 조회 실패:", error);
    }
  };

  const fetchShops = async () => {
    setIsLoading(true);
    try {
      const regionDesc = selectedRegion
        ? regions.find((r) => r.code === selectedRegion)?.description
        : undefined;
      const districtDesc = selectedDistrict
        ? districts.find((d) => d.code === selectedDistrict)?.description
        : undefined;

      const response = await flowerApi.searchShops(
        flowerName,
        regionDesc,
        districtDesc,
        currentPage,
        12,
      );

      setShops(response.content ?? []);
      setTotalPages(response.totalPages ?? 0);
    } catch (error: any) {
      console.error("꽃집 목록 조회 실패:", error);
      if (error.response?.status === 204) {
        setShops([]);
        setTotalPages(0);
      } else {
        alert("꽃집 목록을 불러오는데 실패했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRegion(e.target.value);
    setSelectedDistrict("");
    setCurrentPage(0);
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDistrict(e.target.value);
    setCurrentPage(0);
  };

  const handleShopClick = (shopId: number) => {
    navigate(`/shops/${shopId}`);
  };

  if (!flowerName) {
    return (
      <Container>
        <EmptyContainer>
          <EmptyText>꽃을 선택해주세요.</EmptyText>
          <BackButton onClick={() => navigate("/flowers")}>
            꽃 선택하러 가기
          </BackButton>
        </EmptyContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>"{flowerName}" 꽃을 판매하는 꽃집</Title>
        <Subtitle>
          지역을 선택하면 더 정확한 검색 결과를 볼 수 있습니다
        </Subtitle>
      </Header>

      <FilterSection>
        <FilterLabel>지역 필터</FilterLabel>
        <FilterRow>
          <Select value={selectedRegion} onChange={handleRegionChange}>
            <option value="">시/도 선택</option>
            {regions.map((region) => (
              <option key={region.code} value={region.code}>
                {region.description}
              </option>
            ))}
          </Select>

          <Select
            value={selectedDistrict}
            onChange={handleDistrictChange}
            disabled={!selectedRegion}
          >
            <option value="">구/군 선택</option>
            {districts.map((district) => (
              <option key={district.code} value={district.code}>
                {district.description}
              </option>
            ))}
          </Select>

          {(selectedRegion || selectedDistrict) && (
            <ResetButton
              onClick={() => {
                setSelectedRegion("");
                setSelectedDistrict("");
                setCurrentPage(0);
              }}
            >
              필터 초기화
            </ResetButton>
          )}
        </FilterRow>
      </FilterSection>

      {isLoading ? (
        <LoadingContainer>
          <Spinner />
          <LoadingText>꽃집 목록을 불러오는 중...</LoadingText>
        </LoadingContainer>
      ) : shops.length === 0 ? (
        <EmptyContainer>
          <EmptyText>해당 조건의 꽃집이 없습니다.</EmptyText>
          <BackButton onClick={() => navigate("/flowers")}>
            다른 꽃 선택하기
          </BackButton>
        </EmptyContainer>
      ) : (
        <>
          <ShopGrid>
            {shops.map((shop) => (
              <ShopCard key={shop.id} onClick={() => handleShopClick(shop.id)}>
                <ShopHeader>
                  <ShopName>{shop.shopName}</ShopName>
                  <LocationBadge>
                    {shop.regionDescription} {shop.districtDescription}
                  </LocationBadge>
                </ShopHeader>
                <ShopDescription>
                  {shop.description || "설명이 없습니다"}
                </ShopDescription>
                <ShopInfo>
                  <InfoItem>
                    <InfoIcon>📍</InfoIcon>
                    {shop.address}
                  </InfoItem>
                  <InfoItem>
                    <InfoIcon>📞</InfoIcon>
                    {shop.telnum}
                  </InfoItem>
                </ShopInfo>
              </ShopCard>
            ))}
          </ShopGrid>

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

const FilterSection = styled.div`
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const FilterLabel = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1rem;
`;

const FilterRow = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
`;

const Select = styled.select`
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  flex: 1;
  min-width: 150px;

  &:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
  }

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ResetButton = styled.button`
  padding: 0.5rem 1rem;
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

const ShopGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const ShopCard = styled.div`
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
`;

const ShopHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 0.75rem;
`;

const ShopName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
`;

const LocationBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background-color: #eff6ff;
  color: #3b82f6;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
`;

const ShopDescription = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1rem;
  line-height: 1.5;
`;

const ShopInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #4b5563;
`;

const InfoIcon = styled.span`
  font-size: 1rem;
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

const BackButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #2563eb;
  }
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
