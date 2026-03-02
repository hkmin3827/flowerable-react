import React, { useState, useEffect } from "react";
import { adminUserAPI, adminShopAPI } from "@/features/admin/api";
import {
  AdminUser,
  AdminShop,
  UserDetail,
  ShopDetail,
} from "@/features/admin/types";
import {
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
import { extractErrorMessage } from "@/shared/utils/errorHandler";
import {
  ActionButtons,
  CloseButton,
  DetailSection,
  DetailRow,
  DetailLabel,
  DetailValue,
  SubTabList,
} from "./AdminAccountManagePage.styles";

type MainTabType = "ALL" | "USER" | "SHOP";
type StatusTabType = "ALL" | "ACTIVE" | "SUSPENDED" | "DELETED";

const AdminAccountManagePage: React.FC = () => {
  const [mainTab, setMainTab] = useState<MainTabType>("ALL");
  const [statusTab, setStatusTab] = useState<StatusTabType>("ALL");
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
  }, [mainTab, statusTab, page]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const accountStatus = statusTab === "ALL" ? undefined : statusTab;

      if (mainTab === "USER") {
        const response = await adminUserAPI.getUsers(accountStatus, page, 20);
        setUsers(response.data.content);
        setShops([]);
        setTotalPages(response.data.totalPages);
      } else if (mainTab === "SHOP") {
        const response = await adminShopAPI.getShops(
          undefined,
          accountStatus,
          page,
          20,
        );
        setShops(response.data.content);
        setUsers([]);
        setTotalPages(response.data.totalPages);
      } else {
        const [userResponse, shopResponse] = await Promise.all([
          adminUserAPI.getUsers(accountStatus, page, 10),
          adminShopAPI.getShops(undefined, accountStatus, page, 10),
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
      if (mainTab === "USER" || mainTab === "ALL") {
        const response = await adminUserAPI.searchUsers(
          searchKeyword,
          page,
          20,
        );
        setUsers(response.data.content);
        setTotalPages(response.data.totalPages);
      }
      if (mainTab === "SHOP" || mainTab === "ALL") {
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
      alert(extractErrorMessage(error));
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
      alert(extractErrorMessage(error));
    }
  };

  const handleToggleShopAccountStatus = async (
    shopId: number,
    currentStatus: string,
  ) => {
    try {
      if (currentStatus === "ACTIVE") {
        await adminShopAPI.suspendShopAccount(shopId);
        alert("샵 계정을 정지했습니다.");
      } else {
        await adminShopAPI.activeShopAccount(shopId);
        alert("샵 계정을 활성화했습니다.");
      }
      fetchData();
    } catch (error) {
      console.error("Failed to toggle shop account status:", error);
      alert(extractErrorMessage(error));
    }
  };

  const handleViewUserDetail = async (userId: number) => {
    try {
      const response = await adminUserAPI.getUserDetail(userId);
      setSelectedUserDetail(response.data);
    } catch (error) {
      console.error("Failed to fetch user detail:", error);
      alert(extractErrorMessage(error));
    }
  };

  const handleViewShopDetail = async (shopId: number) => {
    try {
      const response = await adminShopAPI.getShopDetail(shopId);
      setSelectedShopDetail(response.data);
    } catch (error) {
      console.error("Failed to fetch shop detail:", error);
      alert(extractErrorMessage(error));
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "success";
      case "SUSPENDED":
        return "warning";
      case "DELETED":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "활성";
      case "SUSPENDED":
        return "정지";
      case "DELETED":
        return "삭제됨";
      case "TEMP":
        return "임시";
      default:
        return status;
    }
  };

  return (
    <Container>
      <PageTitle>계정 관리</PageTitle>

      <TabList>
        <Tab
          $active={mainTab === "ALL"}
          onClick={() => {
            setMainTab("ALL");
            setPage(0);
          }}
        >
          전체
        </Tab>
        <Tab
          $active={mainTab === "USER"}
          onClick={() => {
            setMainTab("USER");
            setPage(0);
          }}
        >
          사용자
        </Tab>
        <Tab
          $active={mainTab === "SHOP"}
          onClick={() => {
            setMainTab("SHOP");
            setPage(0);
          }}
        >
          샵
        </Tab>
      </TabList>

      <SubTabList>
        <Tab
          $active={statusTab === "ALL"}
          onClick={() => {
            setStatusTab("ALL");
            setPage(0);
          }}
        >
          전체
        </Tab>
        <Tab
          $active={statusTab === "ACTIVE"}
          onClick={() => {
            setStatusTab("ACTIVE");
            setPage(0);
          }}
        >
          활성
        </Tab>
        <Tab
          $active={statusTab === "SUSPENDED"}
          onClick={() => {
            setStatusTab("SUSPENDED");
            setPage(0);
          }}
        >
          정지
        </Tab>
        <Tab
          $active={statusTab === "DELETED"}
          onClick={() => {
            setStatusTab("DELETED");
            setPage(0);
          }}
        >
          삭제
        </Tab>
      </SubTabList>

      <SearchBar>
        <Input
          type="text"
          placeholder="이름 또는 이메일로 검색"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button variant="primary" onClick={handleSearch}>
          <Search size={20} />
          검색
        </Button>
      </SearchBar>

      {loading ? (
        <LoadingContainer>로딩 중...</LoadingContainer>
      ) : (
        <>
          {mainTab !== "SHOP" && users.length > 0 && (
            <Card>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>ID</TableHeader>
                    <TableHeader>이름</TableHeader>
                    <TableHeader>이메일</TableHeader>
                    <TableHeader>전화번호</TableHeader>
                    <TableHeader>계정 상태</TableHeader>
                    <TableHeader>가입일</TableHeader>
                    <TableHeader>작업</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow
                      key={user.id}
                      onClick={() => handleViewUserDetail(user.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.accountEmail}</TableCell>
                      <TableCell>{user.accountTelnum}</TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusBadgeVariant(user.accountStatus)}
                        >
                          {getStatusText(user.accountStatus)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        {user.accountStatus !== "DELETED" && (
                          <ActionButtons>
                            {user.accountStatus === "ACTIVE" ? (
                              <Button
                                variant="error"
                                onClick={() =>
                                  handleToggleUserStatus(
                                    user.id,
                                    user.accountStatus,
                                  )
                                }
                              >
                                정지
                              </Button>
                            ) : (
                              <Button
                                variant="success"
                                onClick={() =>
                                  handleToggleUserStatus(
                                    user.id,
                                    user.accountStatus,
                                  )
                                }
                              >
                                활성화
                              </Button>
                            )}
                          </ActionButtons>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}

          {mainTab !== "USER" && shops.length > 0 && (
            <Card>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>ID</TableHeader>
                    <TableHeader>샵명</TableHeader>
                    <TableHeader>이메일</TableHeader>
                    <TableHeader>주소</TableHeader>
                    <TableHeader>계정 상태</TableHeader>
                    <TableHeader>샵 상태</TableHeader>
                    <TableHeader>등록일</TableHeader>
                    <TableHeader>작업</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {shops.map((shop) => (
                    <TableRow
                      key={shop.id}
                      onClick={() => handleViewShopDetail(shop.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <TableCell>{shop.id}</TableCell>
                      <TableCell>{shop.shopName}</TableCell>
                      <TableCell>{shop.accountEmail}</TableCell>
                      <TableCell>{shop.address}</TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusBadgeVariant(shop.accountStatus)}
                        >
                          {getStatusText(shop.accountStatus)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(shop.status)}>
                          {shop.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(shop.registerAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        {shop.accountStatus !== "DELETED" && (
                          <ActionButtons>
                            {shop.accountStatus === "ACTIVE" ? (
                              <Button
                                variant="error"
                                onClick={() =>
                                  handleToggleShopAccountStatus(
                                    shop.id,
                                    shop.accountStatus,
                                  )
                                }
                              >
                                정지
                              </Button>
                            ) : (
                              <Button
                                variant="success"
                                onClick={() =>
                                  handleToggleShopAccountStatus(
                                    shop.id,
                                    shop.accountStatus,
                                  )
                                }
                              >
                                활성화
                              </Button>
                            )}
                          </ActionButtons>
                        )}
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
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
              >
                이전
              </PageButton>
              <span>
                {page + 1} / {totalPages}
              </span>
              <PageButton
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
              >
                다음
              </PageButton>
            </Pagination>
          )}
        </>
      )}

      {selectedUserDetail && (
        <ModalOverlay onClick={() => setSelectedUserDetail(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                <User size={20} />
                사용자 상세 정보
              </ModalTitle>
              <CloseButton onClick={() => setSelectedUserDetail(null)}>
                <X size={24} />
              </CloseButton>
            </ModalHeader>
            <ModalBody>
              <DetailSection>
                <DetailRow>
                  <DetailLabel>ID</DetailLabel>
                  <DetailValue>{selectedUserDetail.id}</DetailValue>
                </DetailRow>
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
                  <DetailLabel>가입일시</DetailLabel>
                  <DetailValue>
                    {new Date(selectedUserDetail.createdAt).toLocaleString()}
                  </DetailValue>
                </DetailRow>
                {selectedUserDetail.deletedAt && (
                  <DetailRow>
                    <DetailLabel>탈퇴일시</DetailLabel>
                    <DetailValue>
                      {new Date(selectedUserDetail.deletedAt).toLocaleString()}
                    </DetailValue>
                  </DetailRow>
                )}
              </DetailSection>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}

      {selectedShopDetail && (
        <ModalOverlay onClick={() => setSelectedShopDetail(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                <Store size={20} />샵 상세 정보
              </ModalTitle>
              <CloseButton onClick={() => setSelectedShopDetail(null)}>
                <X size={24} />
              </CloseButton>
            </ModalHeader>
            <ModalBody>
              <DetailSection>
                <DetailRow>
                  <DetailLabel>ID</DetailLabel>
                  <DetailValue>{selectedShopDetail.id}</DetailValue>
                </DetailRow>
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
                <DetailRow>
                  <DetailLabel>상태</DetailLabel>
                  <DetailValue>{selectedShopDetail.status}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>등록일시</DetailLabel>
                  <DetailValue>
                    {new Date(selectedShopDetail.registerAt).toLocaleString()}
                  </DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>탈퇴일시</DetailLabel>

                  <DetailValue>
                    {new Date(selectedShopDetail.deletedAt).toLocaleString()}
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
