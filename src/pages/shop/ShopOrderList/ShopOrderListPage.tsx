import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { shopOrderAPI } from "@/features/order/api";
import { OrderList } from "@/features/order/types";
import { format } from "date-fns";
import { OrderStatus } from "@/shared/types";
import { LoadingContainer } from "@/shared/ui/CommonStyles";
import {
  Container,
  PageTitle,
  EmptyState,
  EmptyIcon,
  EmptyText,
  OrdersList,
  OrderCard,
  OrderHeader,
  OrderInfo,
  OrderNumber,
  CustomerName,
  StatusBadge,
  OrderFooter,
  PriceInfo,
  TotalPrice,
  OrderDate,
  ArrowIcon,
  Pagination,
  PageButton,
  PageInfo,
} from "./ShopOrderListPage.styles";

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
      CREATED: "미결제",
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
