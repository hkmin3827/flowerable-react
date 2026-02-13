import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { adminUserAPI, adminShopAPI } from "@/features/admin/api";
import {
  AdminUser,
  AdminShop,
  UserDetail,
  ShopDetail,
} from "@/features/admin/types";
import {
  colors,
  Container,
  PageTitle,
  TabList,
  Tab,
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
} from "@/shared/ui/CommonStyles";
import { Search, User, Store, X } from "lucide-react";

type TabType = "ALL" | "USER" | "SHOP";

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

const DetailSection = styled.div`
  margin-bottom: 1.5rem;
`;

const DetailTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: ${colors.text};
  margin-bottom: 0.75rem;
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

const AdminAccountManagePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("ALL");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [shops, setShops] = useState<AdminShop[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedUserDetail, setSelectedUserDetail] =
    useState<UserDetail | null>(null);
  const [selectedShopDetail, setSelectedShopDetail] =
    useState<ShopDetail | null>(null);

  useEffect(() => {
    fetchData();
  }, [activeTab, page]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "USER") {
        const response = await adminUserAPI.getUsers(undefined, page, 20);
        setUsers(response.data.content);
        setShops([]);
        setTotalPages(response.data.totalPages);
      } else if (activeTab === "SHOP") {
        const response = await adminShopAPI.getShops(undefined, page, 20);
        setShops(response.data.content);
        setUsers([]);
        setTotalPages(response.data.totalPages);
      } else {
        // ALL - 사용자와 샵 모두 가져오기
        const [userResponse, shopResponse] = await Promise.all([
          adminUserAPI.getUsers(undefined, page, 10),
          adminShopAPI.getShops(undefined, page, 10),
        ]);
        setUsers(userResponse.data.content);
        setShops(shopResponse.data.content);
        setTotalPages(
          Math.max(userResponse.data.totalPages, shopResponse.data.totalPages),
        );
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      fetchData();
      return;
    }

    setLoading(true);
    try {
      if (activeTab === "USER" || activeTab === "ALL") {
        const response = await adminUserAPI.searchUsers(
          searchKeyword,
          page,
          20,
        );
        setUsers(response.data.content);
        setTotalPages(response.data.totalPages);
      }
      if (activeTab === "SHOP" || activeTab === "ALL") {
        const response = await adminShopAPI.searchShops(
          searchKeyword,
          page,
          20,
        );
        setShops(response.data.content);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error("Failed to search:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (
    userId: number,
    currentStatus: string,
  ) => {
    try {
      if (currentStatus === "ACTIVE") {
        await adminUserAPI.suspendUser(userId);
        alert("사용자를 정지했습니다.");
      } else {
        await adminUserAPI.activateUser(userId);
        alert("사용자를 활성화했습니다.");
      }
      fetchData();
    } catch (error) {
      console.error("Failed to toggle user status:", error);
      alert("상태 변경에 실패했습니다.");
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
      fetchData();
    } catch (error) {
      console.error("Failed to toggle shop status:", error);
      alert("상태 변경에 실패했습니다.");
    }
  };

  const handleViewUserDetail = async (userId: number) => {
    try {
      const response = await adminUserAPI.getUserDetail(userId);
      setSelectedUserDetail(response.data);
    } catch (error) {
      console.error("Failed to fetch user detail:", error);
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

  return (
    <Container>
      <PageTitle>계정 관리</PageTitle>

      <TabList>
        <Tab
          active={activeTab === "ALL"}
          onClick={() => {
            setActiveTab("ALL");
            setPage(0);
          }}
        >
          전체
        </Tab>
        <Tab
          active={activeTab === "USER"}
          onClick={() => {
            setActiveTab("USER");
            setPage(0);
          }}
        >
          사용자
        </Tab>
        <Tab
          active={activeTab === "SHOP"}
          onClick={() => {
            setActiveTab("SHOP");
            setPage(0);
          }}
        >
          샵
        </Tab>
      </TabList>

      <SearchBar>
        <Input
          type="text"
          placeholder="이름 또는 샵명으로 검색"
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
      ) : (
        <>
          {(activeTab === "USER" || activeTab === "ALL") &&
            users.length > 0 && (
              <Card>
                <h3 style={{ marginBottom: "1rem", fontWeight: "600" }}>
                  <User
                    size={20}
                    style={{ display: "inline", marginRight: "0.5rem" }}
                  />
                  사용자
                </h3>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableHeader>이름</TableHeader>
                      <TableHeader>이메일</TableHeader>
                      <TableHeader>전화번호</TableHeader>
                      <TableHeader>상태</TableHeader>
                      <TableHeader>가입일</TableHeader>
                      <TableHeader>액션</TableHeader>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow
                        key={user.id}
                        onClick={() => handleViewUserDetail(user.id)}
                        style={{ cursor: "pointer" }}
                      >
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.telnum}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.accountStatus === "ACTIVE"
                                ? "success"
                                : "secondary"
                            }
                          >
                            {user.accountStatus === "ACTIVE" ? "활성" : "정지"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <ActionButtons onClick={(e) => e.stopPropagation()}>
                            <Button
                              size="sm"
                              variant={
                                user.accountStatus === "ACTIVE"
                                  ? "error"
                                  : "success"
                              }
                              onClick={() =>
                                handleToggleUserStatus(
                                  user.id,
                                  user.accountStatus,
                                )
                              }
                            >
                              {user.accountStatus === "ACTIVE"
                                ? "정지"
                                : "활성화"}
                            </Button>
                          </ActionButtons>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            )}

          {(activeTab === "SHOP" || activeTab === "ALL") &&
            shops.length > 0 && (
              <Card>
                <h3 style={{ marginBottom: "1rem", fontWeight: "600" }}>
                  <Store
                    size={20}
                    style={{ display: "inline", marginRight: "0.5rem" }}
                  />
                  샵
                </h3>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableHeader>샵명</TableHeader>
                      <TableHeader>이메일</TableHeader>
                      <TableHeader>주소</TableHeader>
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
                        <TableCell>{shop.email}</TableCell>
                        <TableCell>{shop.address}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              shop.status === "ACTIVE"
                                ? "success"
                                : shop.status === "PENDING"
                                  ? "warning"
                                  : "secondary"
                            }
                          >
                            {shop.status === "ACTIVE"
                              ? "활성"
                              : shop.status === "PENDING"
                                ? "대기"
                                : shop.status === "REJECTED"
                                  ? "거부됨"
                                  : "정지"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(shop.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <ActionButtons onClick={(e) => e.stopPropagation()}>
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
                          </ActionButtons>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            )}

          {users.length === 0 && shops.length === 0 && (
            <EmptyState>데이터가 없습니다</EmptyState>
          )}

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

      {/* 사용자 상세 모달 */}
      {selectedUserDetail && (
        <ModalOverlay onClick={() => setSelectedUserDetail(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>사용자 상세 정보</ModalTitle>
              <CloseButton onClick={() => setSelectedUserDetail(null)}>
                <X size={24} />
              </CloseButton>
            </ModalHeader>
            <ModalBody>
              <DetailSection>
                <DetailRow>
                  <DetailLabel>이름</DetailLabel>
                  <DetailValue>{selectedUserDetail.name}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>이메일</DetailLabel>
                  <DetailValue>{selectedUserDetail.email}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>전화번호</DetailLabel>
                  <DetailValue>{selectedUserDetail.telnum}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>상태</DetailLabel>
                  <DetailValue>
                    <Badge
                      variant={
                        selectedUserDetail.active ? "success" : "secondary"
                      }
                    >
                      {selectedUserDetail.active ? "활성" : "정지"}
                    </Badge>
                  </DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>가입일</DetailLabel>
                  <DetailValue>
                    {new Date(selectedUserDetail.createdAt).toLocaleString()}
                  </DetailValue>
                </DetailRow>
                {selectedUserDetail.provider && (
                  <DetailRow>
                    <DetailLabel>소셜 로그인</DetailLabel>
                    <DetailValue>{selectedUserDetail.provider}</DetailValue>
                  </DetailRow>
                )}
              </DetailSection>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
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
              <DetailSection>
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
                  <DetailValue>{selectedShopDetail.address}</DetailValue>
                </DetailRow>
                {selectedShopDetail.description && (
                  <DetailRow>
                    <DetailLabel>설명</DetailLabel>
                    <DetailValue>{selectedShopDetail.description}</DetailValue>
                  </DetailRow>
                )}
                <DetailRow>
                  <DetailLabel>상태</DetailLabel>
                  <DetailValue>
                    <Badge
                      variant={
                        selectedShopDetail.status === "ACTIVE"
                          ? "success"
                          : selectedShopDetail.status === "PENDING"
                            ? "warning"
                            : "secondary"
                      }
                    >
                      {selectedShopDetail.status}
                    </Badge>
                  </DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>등록일</DetailLabel>
                  <DetailValue>
                    {new Date(selectedShopDetail.createdAt).toLocaleString()}
                  </DetailValue>
                </DetailRow>
              </DetailSection>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default AdminAccountManagePage;
