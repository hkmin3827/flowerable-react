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
const ItemSection = styled.div`
  margin: 1rem 0;
  padding: 1rem;
  background: inherit;
  border-radius: 0.5rem;
`;

const ItemTitle = styled.h4`
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
`;

const ItemRow = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr 0.7fr 1fr;
  gap: 0.5rem;
  padding: 0.4rem 0;
  font-size: 0.85rem;
  border-bottom: 1px solid ${colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const ItemHeader = styled(ItemRow)`
  font-weight: 600;
  color: ${colors.textSecondary};
  border-bottom: 2px solid ${colors.border};
`;

const AdminOrderMonitorPage: React.FC = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<any>(null);
  // from
  const [fromYear, setFromYear] = useState("");
  const [fromMonth, setFromMonth] = useState("");
  const [fromDay, setFromDay] = useState("");

  // to
  const [toYear, setToYear] = useState("");
  const [toMonth, setToMonth] = useState("");
  const [toDay, setToDay] = useState("");
  const pad = (n: number) => n.toString().padStart(2, "0");

  const formatLocalDateTime = (date: Date) => {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };

  useEffect(() => {
    fetchOrders();
  }, [
    page,
    statusFilter,
    fromYear,
    fromMonth,
    fromDay,
    toYear,
    toMonth,
    toDay,
  ]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params: OrderSearchParams = {};
      if (statusFilter) {
        params.status = statusFilter;
      }

      if (fromYear && fromMonth && fromDay) {
        const startDate = new Date(
          Number(fromYear),
          Number(fromMonth) - 1,
          Number(fromDay),
          0,
          0,
          0,
        );
        params.from = formatLocalDateTime(startDate);
      }

      if (toYear && toMonth && toDay) {
        const endDate = new Date(
          Number(toYear),
          Number(toMonth) - 1,
          Number(toDay),
          23,
          59,
          59,
        );
        params.to = formatLocalDateTime(endDate);
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
      case "CREATED":
        return <Badge variant="pending">미결제</Badge>;
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
          <option value="CREATED">결제 미완료</option>
          <option value="REQUESTED">요청됨</option>
          <option value="ACCEPTED">접수완료</option>
          <option value="READY">준비완료</option>
          <option value="COMPLETED">완료</option>
          <option value="CANCELED">취소됨</option>
        </Select>
      </FilterBar>
      <FilterBar>
        {/* ===== 시작일 ===== */}
        <Select value={fromYear} onChange={(e) => setFromYear(e.target.value)}>
          <option value="">시작 연도</option>
          {Array.from({ length: 5 }).map((_, i) => {
            const year = new Date().getFullYear() - i;
            return (
              <option key={year} value={year}>
                {year}년
              </option>
            );
          })}
        </Select>
        <Select
          value={fromMonth}
          onChange={(e) => setFromMonth(e.target.value)}
        >
          <option value="">시작 월</option>
          {Array.from({ length: 12 }).map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}월
            </option>
          ))}
        </Select>
        <Select value={fromDay} onChange={(e) => setFromDay(e.target.value)}>
          <option value="">시작 일</option>
          {Array.from({ length: 31 }).map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}일
            </option>
          ))}
        </Select>
        ~
        <Select value={toYear} onChange={(e) => setToYear(e.target.value)}>
          <option value="">종료 연도</option>
          {Array.from({ length: 5 }).map((_, i) => {
            const year = new Date().getFullYear() - i;
            return (
              <option key={year} value={year}>
                {year}년
              </option>
            );
          })}
        </Select>
        <Select value={toMonth} onChange={(e) => setToMonth(e.target.value)}>
          <option value="">종료 월</option>
          {Array.from({ length: 12 }).map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}월
            </option>
          ))}
        </Select>
        <Select value={toDay} onChange={(e) => setToDay(e.target.value)}>
          <option value="">종료 일</option>
          {Array.from({ length: 31 }).map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}일
            </option>
          ))}
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
                <DetailLabel>상태</DetailLabel>
                <DetailValue>
                  {getStatusBadge(selectedOrderDetail.status)}
                </DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>샵명</DetailLabel>
                <DetailValue>{selectedOrderDetail.shopName}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>샵 전화번호</DetailLabel>
                <DetailValue>{selectedOrderDetail.shopTelnum}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>고객명</DetailLabel>
                <DetailValue>{selectedOrderDetail.userName}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>고객 전화번호</DetailLabel>
                <DetailValue>{selectedOrderDetail.userTelnum}</DetailValue>
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
              <DetailRow>
                <DetailLabel>취소일시</DetailLabel>
                <DetailValue>
                  {format(
                    new Date(selectedOrderDetail.canceledAt),
                    "yyyy년 MM월 dd일 HH:mm",
                  )}
                </DetailValue>
              </DetailRow>
              {selectedOrderDetail.items &&
                selectedOrderDetail.items.length > 0 && (
                  <ItemSection>
                    <ItemTitle>주문 항목</ItemTitle>

                    <ItemHeader>
                      <span>꽃 이름</span>
                      <span>색상</span>
                      <span>수량</span>
                      <span>개당 가격</span>
                    </ItemHeader>

                    {selectedOrderDetail.items.map(
                      (item: any, index: number) => (
                        <ItemRow key={index}>
                          <span>{item.flowerName}</span>
                          <span>{item.flowerColor}</span>
                          <span>{item.quantity}개</span>
                          <span>{item.basePrice?.toLocaleString()}원</span>
                        </ItemRow>
                      ),
                    )}

                    <ItemHeader>
                      <span>포장지 색상</span>
                      <span>포장 금액</span>
                    </ItemHeader>

                    <ItemRow>
                      <span>{selectedOrderDetail.wrappingColorName}</span>
                      <span>{selectedOrderDetail.wrappingExtraPrice}</span>
                    </ItemRow>
                  </ItemSection>
                )}
              {selectedOrderDetail.status === "CANCELED" && (
                <CancelInfo>
                  <CancelTitle>취소 정보</CancelTitle>
                  <CancelText>
                    취소자: {selectedOrderDetail.cancelBy}
                  </CancelText>
                  {selectedOrderDetail.cancelBy === "가게" &&
                    selectedOrderDetail.cancelReason && (
                      <CancelText>
                        사유:
                        {selectedOrderDetail.cancelReason}
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
