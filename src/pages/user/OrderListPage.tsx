import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { orderApi } from "@/features/order/api";
import { OrderListResponse } from "@/features/order/types";
import { OrderStatus } from "@/shared/types";

export const OrderListPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderListResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | undefined>(
    undefined,
  );

  const statusOptions: { value: OrderStatus | undefined; label: string }[] = [
    { value: undefined, label: "전체" },
    { value: "REQUESTED", label: "대기중" },
    { value: "ACCEPTED", label: "접수됨" },
    { value: "READY", label: "준비완료" },
    { value: "COMPLETED", label: "픽업완료" },
    { value: "CANCELLED", label: "취소됨" },
  ];

  useEffect(() => {
    fetchOrders();
  }, [currentPage, selectedStatus]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await orderApi.getUserOrders(
        currentPage,
        10,
        selectedStatus,
      );
      setOrders(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("주문 목록 조회 실패:", error);
      alert("주문 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = (status: OrderStatus | undefined) => {
    setSelectedStatus(status);
    setCurrentPage(0);
  };

  const handleOrderClick = (orderId: number) => {
    navigate(`/orders/${orderId}`);
  };

  const getStatusColor = (status: OrderStatus): string => {
    const colors: Record<OrderStatus, string> = {
      PENDING: "#f59e0b",
      CONFIRMED: "#3b82f6",
      IN_PROGRESS: "#8b5cf6",
      READY: "#10b981",
      COMPLETED: "#6b7280",
      CANCELLED: "#ef4444",
    };
    return colors[status] || "#6b7280";
  };

  const getStatusLabel = (status: OrderStatus): string => {
    const labels: Record<OrderStatus, string> = {
      PENDING: "대기중",
      CONFIRMED: "확인됨",
      IN_PROGRESS: "진행중",
      READY: "준비완료",
      COMPLETED: "완료",
      CANCELLED: "취소됨",
    };
    return labels[status] || status;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const formatPrice = (price: number): string => {
    return price.toLocaleString("ko-KR");
  };

  return (
    <Container>
      <Header>
        <Title>주문 내역</Title>
        <Subtitle>주문하신 내역을 확인하실 수 있습니다</Subtitle>
      </Header>

      <StatusFilter>
        {statusOptions.map((option) => (
          <StatusButton
            key={option.label}
            $active={selectedStatus === option.value}
            onClick={() => handleStatusChange(option.value)}
          >
            {option.label}
          </StatusButton>
        ))}
      </StatusFilter>

      {isLoading ? (
        <LoadingContainer>
          <Spinner />
          <LoadingText>주문 내역을 불러오는 중...</LoadingText>
        </LoadingContainer>
      ) : orders.length === 0 ? (
        <EmptyContainer>
          <EmptyText>주문 내역이 없습니다.</EmptyText>
          <BackButton onClick={() => navigate("/flowers")}>
            꽃 주문하러 가기
          </BackButton>
        </EmptyContainer>
      ) : (
        <>
          <OrderList>
            {orders.map((order) => (
              <OrderCard
                key={order.orderId}
                onClick={() => handleOrderClick(order.orderId)}
              >
                <OrderHeader>
                  <OrderNumber>주문번호: {order.orderId}</OrderNumber>
                  <StatusBadge $color={getStatusColor(order.status)}>
                    {getStatusLabel(order.status)}
                  </StatusBadge>
                </OrderHeader>

                <OrderInfo>
                  <InfoRow>
                    <InfoLabel>주문일시</InfoLabel>
                    <InfoValue>{formatDate(order.createdAt)}</InfoValue>
                  </InfoRow>
                  <InfoRow>
                    <InfoLabel>총 금액</InfoLabel>
                    <InfoValue $highlight>
                      {formatPrice(order.totalPrice)}원
                    </InfoValue>
                  </InfoRow>
                </OrderInfo>
              </OrderCard>
            ))}
          </OrderList>

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
  max-width: 1000px;
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

const StatusFilter = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const StatusButton = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1.25rem;
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

const OrderList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const OrderCard = styled.div`
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
`;

const OrderNumber = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
`;

const StatusBadge = styled.span<{ $color: string }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background-color: ${(props) => props.$color}20;
  color: ${(props) => props.$color};
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const OrderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const InfoLabel = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
`;

const InfoValue = styled.span<{ $highlight?: boolean }>`
  font-size: 0.875rem;
  font-weight: ${(props) => (props.$highlight ? "600" : "400")};
  color: ${(props) => (props.$highlight ? "#111827" : "#374151")};
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
