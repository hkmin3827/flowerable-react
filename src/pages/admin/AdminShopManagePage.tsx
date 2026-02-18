import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { adminShopAPI } from "@/features/admin/api";
import { AdminShop, ShopDetail } from "@/features/admin/types";
import {
  colors,
  Container,
  PageTitle,
  Card,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
  Badge,
  Button,
  SearchBar,
  Input,
  LoadingContainer,
  EmptyState,
  Pagination,
  PageButton,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  Select,
} from "@/shared/ui/CommonStyles";
import { Search, X } from "lucide-react";

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const CloseButton = styled.button`
  padding: 0.25rem;
  border: none;
  background: transparent;
  cursor: pointer;
  color: ${colors.textSecondary};
  transition: color 0.2s;

  &:hover {
    color: ${colors.text};
  }
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid ${colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const DetailLabel = styled.span`
  color: ${colors.textSecondary};
  font-size: 0.875rem;
`;

const DetailValue = styled.span`
  font-weight: 500;
  font-size: 0.875rem;
`;

const FilterBar = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const AdminShopManagePage: React.FC = () => {
  const [shops, setShops] = useState<AdminShop[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined,
  );
  const [selectedShopDetail, setSelectedShopDetail] =
    useState<ShopDetail | null>(null);

  useEffect(() => {
    fetchShops();
  }, [page, statusFilter]);

  const fetchShops = async () => {
    setLoading(true);
    try {
      const shopStatus = statusFilter === "ALL" ? undefined : statusFilter;

      const response = await adminShopAPI.getShops(
        shopStatus,
        undefined,
        page,
        20,
      );
      setShops(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch shops:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      fetchShops();
      return;
    }

    setLoading(true);
    try {
      const response = await adminShopAPI.searchShops(searchKeyword, page, 20);
      setShops(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Failed to search:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveShop = async (shopId: number) => {
    if (!window.confirm("이 샵을 승인하시겠습니까?")) return;

    try {
      await adminShopAPI.approveShop(shopId);
      alert("샵이 승인되었습니다.");
      fetchShops();
    } catch (error) {
      console.error("Failed to approve shop:", error);
      alert("샵 승인에 실패했습니다.");
    }
  };

  const handleRejectShop = async (shopId: number) => {
    if (!window.confirm("이 샵을 거부하시겠습니까?")) return;

    try {
      await adminShopAPI.rejectShop(shopId);
      alert("샵이 거부되었습니다.");
      fetchShops();
    } catch (error) {
      console.error("Failed to reject shop:", error);
      alert("샵 거부에 실패했습니다.");
    }
  };

  const handleToggleShopStatus = async (
    shopId: number,
    currentStatus: string,
  ) => {
    try {
      if (currentStatus === "ACTIVE") {
        await adminShopAPI.suspendShop(shopId);
        alert("샵을 정지했습니다.");
      } else {
        await adminShopAPI.activateShop(shopId);
        alert("샵을 활성화했습니다.");
      }
      fetchShops();
    } catch (error: any) {
      alert(error.response?.data?.message || "상태 변경에 실패했습니다.");
    }
  };

  const handleViewShopDetail = async (shopId: number) => {
    try {
      const response = await adminShopAPI.getShopDetail(shopId);
      setSelectedShopDetail(response.data);
    } catch (error) {
      console.error("Failed to fetch shop detail:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge variant="success">활성</Badge>;
      case "PENDING":
        return <Badge variant="warning">승인 대기</Badge>;
      case "REJECTED":
        return <Badge variant="error">거부됨</Badge>;
      case "SUSPENDED":
        return <Badge variant="secondary">정지</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Container>
      <PageTitle>샵 관리</PageTitle>

      <FilterBar>
        <Select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value || undefined);
            setPage(0);
          }}
        >
          <option value="">전체 상태</option>
          <option value="PENDING">승인 대기</option>
          <option value="ACTIVE">활성</option>
          <option value="SUSPENDED">정지</option>
          <option value="REJECTED">거부됨</option>
        </Select>
      </FilterBar>

      <SearchBar>
        <Input
          type="text"
          placeholder="샵명으로 검색"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button onClick={handleSearch}>
          <Search size={18} />
          검색
        </Button>
      </SearchBar>

      {loading ? (
        <LoadingContainer>로딩 중...</LoadingContainer>
      ) : shops.length === 0 ? (
        <EmptyState>샵이 없습니다</EmptyState>
      ) : (
        <>
          <Card>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>샵명</TableHeader>
                  <TableHeader>이메일</TableHeader>
                  <TableHeader>전화번호</TableHeader>
                  <TableHeader>상태</TableHeader>
                  <TableHeader>등록일</TableHeader>
                  <TableHeader>액션</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {shops.map((shop) => (
                  <TableRow
                    key={shop.id}
                    onClick={() => handleViewShopDetail(shop.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <TableCell>{shop.shopName}</TableCell>
                    <TableCell>{shop.accountEmail}</TableCell>

                    <TableCell>{shop.accountTelnum}</TableCell>
                    <TableCell>{getStatusBadge(shop.status)}</TableCell>
                    <TableCell>
                      {new Date(shop.registerAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <ActionButtons onClick={(e) => e.stopPropagation()}>
                        {shop.status === "PENDING" && (
                          <>
                            <Button
                              size="sm"
                              variant="success"
                              onClick={() => handleApproveShop(shop.id)}
                            >
                              승인
                            </Button>
                            <Button
                              size="sm"
                              variant="error"
                              onClick={() => handleRejectShop(shop.id)}
                            >
                              거부
                            </Button>
                          </>
                        )}
                        {(shop.status === "ACTIVE" ||
                          shop.status === "SUSPENDED") && (
                          <Button
                            size="sm"
                            variant={
                              shop.status === "ACTIVE" ? "error" : "success"
                            }
                            onClick={() =>
                              handleToggleShopStatus(shop.id, shop.status)
                            }
                          >
                            {shop.status === "ACTIVE" ? "정지" : "활성화"}
                          </Button>
                        )}
                      </ActionButtons>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {totalPages > 1 && (
            <Pagination>
              <PageButton
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                이전
              </PageButton>
              <span style={{ padding: "0.5rem 1rem" }}>
                {page + 1} / {totalPages}
              </span>
              <PageButton
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
              >
                다음
              </PageButton>
            </Pagination>
          )}
        </>
      )}

      {/* 샵 상세 모달 */}
      {selectedShopDetail && (
        <ModalOverlay onClick={() => setSelectedShopDetail(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>샵 상세 정보</ModalTitle>
              <CloseButton onClick={() => setSelectedShopDetail(null)}>
                <X size={24} />
              </CloseButton>
            </ModalHeader>
            <ModalBody>
              <DetailRow>
                <DetailLabel>샵명</DetailLabel>
                <DetailValue>{selectedShopDetail.shopName}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>이메일</DetailLabel>
                <DetailValue>{selectedShopDetail.email}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>전화번호</DetailLabel>
                <DetailValue>{selectedShopDetail.telnum}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>주소</DetailLabel>
                <DetailValue>
                  {selectedShopDetail.regionDesc}{" "}
                  {selectedShopDetail.districtDesc} {selectedShopDetail.address}
                </DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>설명</DetailLabel>
                <DetailValue>{selectedShopDetail.description}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>상태</DetailLabel>
                <DetailValue>
                  {getStatusBadge(selectedShopDetail.status)}
                </DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>등록일</DetailLabel>
                <DetailValue>
                  {new Date(selectedShopDetail.registerAt).toLocaleString()}
                </DetailValue>
              </DetailRow>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default AdminShopManagePage;
