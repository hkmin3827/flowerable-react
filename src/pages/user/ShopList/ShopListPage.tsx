import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { flowerApi } from "@/features/search/api";
import { Shop, Region, District } from "@/features/search/types";
import { extractErrorMessage } from "@/shared/utils/errorHandler";
import {
  Container,
  Header,
  Title,
  Subtitle,
  FilterSection,
  FilterLabel,
  FilterRow,
  Select,
  ResetButton,
  ShopGrid,
  ShopCard,
  ShopHeader,
  ShopName,
  LocationBadge,
  ShopDescription,
  ShopInfo,
  InfoItem,
  InfoIcon,
  LoadingContainer,
  Spinner,
  LoadingText,
  EmptyContainer,
  EmptyText,
  BackButton,
  Pagination,
  PageButton,
  PageInfo,
} from "./ShopListPage.styles";

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
      console.log(shops);
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
        alert(extractErrorMessage(error));
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
              <ShopCard
                key={shop.shopId}
                onClick={() => handleShopClick(shop.shopId)}
              >
                <ShopHeader>
                  <ShopName>{shop.shopName}</ShopName>
                  <LocationBadge>
                    {shop.regionDesc} {shop.districtDesc}
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
