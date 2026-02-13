import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { shopOrderAPI } from "@/features/order/api";
import { OrderList } from "@/features/order/types";
import { format } from "date-fns";
import { Package, ChevronRight } from "lucide-react";
import { OrderStatus } from "@/shared/types";
import { colors, LoadingContainer } from "@/shared/ui/CommonStyles";

const Container = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const PageTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: bold;
  color: ${colors.text};
  margin-bottom: 2rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 1rem;
`;

const EmptyIcon = styled(Package)`
  margin: 0 auto 1rem;
  color: #d1d5db;
`;

const EmptyText = styled.p`
  color: ${colors.textSecondary};
  font-size: 1rem;
`;

const OrdersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const OrderCard = styled.div`
  background: ${colors.white};
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const OrderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const OrderNumber = styled.p`
  font-size: 0.875rem;
  color: ${colors.textSecondary};
`;

const CustomerName = styled.h3`
  font-size: 1.125rem;
  font-weight: bold;
  color: ${colors.text};
`;

const StatusBadge = styled.span<{ status: OrderStatus }>`
  display: inline-block;
  padding: 0.375rem 0.875rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;

  ${({ status }) => {
    switch (status) {
      case "REQUESTED":
        return `background: ${colors.errorLight}; color: ${colors.error};`;
      case "ACCEPTED":
        return `background: ${colors.infoLight}; color: ${colors.info};`;
      case "READY":
        return `background: ${colors.successLight}; color: ${colors.success};`;
      case "COMPLETED":
        return `background: #F3F4F6; color: #6B7280;`;
      case "CANCELED":
        return `background: #F3F4F6; color: #9CA3AF;`;
      default:
        return `background: #F3F4F6; color: #6B7280;`;
    }
  }}
`;

const OrderFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PriceInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const TotalPrice = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${colors.primary};
`;

const OrderDate = styled.p`
  font-size: 0.875rem;
  color: ${colors.textSecondary};
`;

const ArrowIcon = styled(ChevronRight)`
  color: #9ca3af;
  flex-shrink: 0;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;

const PageButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background: ${colors.background};
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${colors.border};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PageInfo = styled.span`
  padding: 0.5rem 1rem;
  color: ${colors.text};
  font-weight: 500;
`;

const ShopOrderListPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderList[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await shopOrderAPI.getOrders(page, 10);
      setOrders(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status: OrderStatus) => {
    const statusMap = {
      REQUESTED: "신규주문",
      ACCEPTED: "접수완료",
      READY: "준비완료",
      COMPLETED: "완료",
      CANCELED: "취소됨",
    };
    return statusMap[status];
  };

  if (loading) {
    return (
      <Container>
        <LoadingContainer>로딩 중...</LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <PageTitle>주문 관리</PageTitle>

      {orders.length === 0 ? (
        <EmptyState>
          <EmptyIcon size={64} />
          <EmptyText>주문이 없습니다</EmptyText>
        </EmptyState>
      ) : (
        <OrdersList>
          {orders.map((order) => (
            <OrderCard
              key={order.orderId}
              onClick={() => navigate(`/shop/orders/${order.orderId}`)}
            >
              <OrderHeader>
                <OrderInfo>
                  <OrderNumber>주문번호: {order.orderNumber}</OrderNumber>
                  <CustomerName>{order.userName}</CustomerName>
                </OrderInfo>
                <StatusBadge status={order.status}>
                  {getStatusText(order.status)}
                </StatusBadge>
              </OrderHeader>

              <OrderFooter>
                <PriceInfo>
                  <TotalPrice>{order.totalPrice.toLocaleString()}원</TotalPrice>
                  <OrderDate>
                    {format(new Date(order.createdAt), "yyyy.MM.dd HH:mm")}
                  </OrderDate>
                </PriceInfo>
                <ArrowIcon size={24} />
              </OrderFooter>
            </OrderCard>
          ))}
        </OrdersList>
      )}

      {totalPages > 1 && (
        <Pagination>
          <PageButton
            onClick={() => setPage((prev) => Math.max(0, prev - 1))}
            disabled={page === 0}
          >
            이전
          </PageButton>
          <PageInfo>
            {page + 1} / {totalPages}
          </PageInfo>
          <PageButton
            onClick={() =>
              setPage((prev) => Math.min(totalPages - 1, prev + 1))
            }
            disabled={page === totalPages - 1}
          >
            다음
          </PageButton>
        </Pagination>
      )}
    </Container>
  );
};

export default ShopOrderListPage;
