import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { adminOrderAPI } from "@/features/admin/api";
import { AdminOrder, OrderSearchParams } from "@/features/admin/types";
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
  LoadingContainer,
  EmptyState,
  Pagination,
  PageButton,
  Select,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
} from "@/shared/ui/CommonStyles";
import { X } from "lucide-react";
import { format } from "date-fns";

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

const FilterBar = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
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

const CancelInfo = styled.div`
  background: ${colors.errorLight};
  padding: 1rem;
  border-radius: 0.375rem;
  margin-top: 1rem;
`;

const CancelTitle = styled.h4`
  font-weight: 600;
  color: ${colors.error};
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`;

const CancelText = styled.p`
  font-size: 0.875rem;
  color: ${colors.text};
`;

const AdminOrderMonitorPage: React.FC = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<any>(null);

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params: OrderSearchParams = {};
      if (statusFilter) {
        params.status = statusFilter;
      }
      const response = await adminOrderAPI.getOrders(params, page, 20);
      setOrders(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrderDetail = async (orderId: number) => {
    try {
      const response = await adminOrderAPI.getOrderDetail(orderId);
      setSelectedOrderDetail(response.data);
    } catch (error) {
      console.error("Failed to fetch order detail:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "REQUESTED":
        return <Badge variant="warning">요청됨</Badge>;
      case "ACCEPTED":
        return <Badge variant="info">접수완료</Badge>;
      case "READY":
        return <Badge variant="success">준비완료</Badge>;
      case "COMPLETED":
        return <Badge variant="secondary">완료</Badge>;
      case "CANCELED":
        return <Badge variant="error">취소됨</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getCancelReasonText = (reason?: string) => {
    if (!reason) return "";
    const reasonMap: { [key: string]: string } = {
      OUT_OF_STOCK: "재고 부족",
      CUSTOMER_REQUEST: "주문자 요청",
      CANNOT_FULFILL_REQUEST: "요청 사항 어려움",
      SHOP_CLOSED: "영업 종료 / 임시 휴무",
      PRICE_ERROR: "가격 오류",
      OTHER: "가게 사정",
    };
    return reasonMap[reason] || reason;
  };

  return (
    <Container>
      <PageTitle>주문 모니터링</PageTitle>

      <FilterBar>
        <Select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(0);
          }}
        >
          <option value="">전체 상태</option>
          <option value="REQUESTED">요청됨</option>
          <option value="ACCEPTED">접수완료</option>
          <option value="READY">준비완료</option>
          <option value="COMPLETED">완료</option>
          <option value="CANCELED">취소됨</option>
        </Select>
      </FilterBar>

      {loading ? (
        <LoadingContainer>로딩 중...</LoadingContainer>
      ) : orders.length === 0 ? (
        <EmptyState>주문이 없습니다</EmptyState>
      ) : (
        <>
          <Card>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>주문번호</TableHeader>
                  <TableHeader>샵명</TableHeader>
                  <TableHeader>고객명</TableHeader>
                  <TableHeader>금액</TableHeader>
                  <TableHeader>상태</TableHeader>
                  <TableHeader>취소 정보</TableHeader>
                  <TableHeader>주문일시</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow
                    key={order.orderId}
                    onClick={() => handleViewOrderDetail(order.orderId)}
                    style={{ cursor: "pointer" }}
                  >
                    <TableCell>{order.orderNumber}</TableCell>
                    <TableCell>{order.shopName}</TableCell>
                    <TableCell>{order.userName}</TableCell>
                    <TableCell>{order.totalPrice.toLocaleString()}원</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>
                      {order.status === "CANCELED" && (
                        <>
                          <Badge variant="error">
                            {order.canceledBy === "USER" ? "사용자" : "샵"}
                          </Badge>
                          {order.canceledBy === "SHOP" &&
                            order.cancelReason && (
                              <div
                                style={{
                                  fontSize: "0.75rem",
                                  marginTop: "0.25rem",
                                  color: colors.textSecondary,
                                }}
                              >
                                {getCancelReasonText(order.cancelReason)}
                              </div>
                            )}
                        </>
                      )}
                    </TableCell>
                    <TableCell>
                      {format(new Date(order.createdAt), "yyyy.MM.dd HH:mm")}
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

      {/* 주문 상세 모달 */}
      {selectedOrderDetail && (
        <ModalOverlay onClick={() => setSelectedOrderDetail(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>주문 상세 정보</ModalTitle>
              <CloseButton onClick={() => setSelectedOrderDetail(null)}>
                <X size={24} />
              </CloseButton>
            </ModalHeader>
            <ModalBody>
              <DetailRow>
                <DetailLabel>주문번호</DetailLabel>
                <DetailValue>{selectedOrderDetail.orderNumber}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>샵명</DetailLabel>
                <DetailValue>{selectedOrderDetail.shopName}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>고객명</DetailLabel>
                <DetailValue>{selectedOrderDetail.userName}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>전화번호</DetailLabel>
                <DetailValue>{selectedOrderDetail.userPhoneNumber}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>상태</DetailLabel>
                <DetailValue>
                  {getStatusBadge(selectedOrderDetail.status)}
                </DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>총 금액</DetailLabel>
                <DetailValue
                  style={{ color: colors.primary, fontWeight: "bold" }}
                >
                  {selectedOrderDetail.totalPrice?.toLocaleString()}원
                </DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>주문일시</DetailLabel>
                <DetailValue>
                  {format(
                    new Date(selectedOrderDetail.createdAt),
                    "yyyy년 MM월 dd일 HH:mm",
                  )}
                </DetailValue>
              </DetailRow>

              {selectedOrderDetail.status === "CANCELED" && (
                <CancelInfo>
                  <CancelTitle>취소 정보</CancelTitle>
                  <CancelText>
                    취소자:{" "}
                    {selectedOrderDetail.canceledBy === "USER"
                      ? "사용자"
                      : "샵"}
                  </CancelText>
                  {selectedOrderDetail.canceledBy === "SHOP" &&
                    selectedOrderDetail.cancelReason && (
                      <CancelText>
                        사유:{" "}
                        {getCancelReasonText(selectedOrderDetail.cancelReason)}
                      </CancelText>
                    )}
                </CancelInfo>
              )}
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default AdminOrderMonitorPage;
