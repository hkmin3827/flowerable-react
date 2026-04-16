import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { shopOrderAPI } from "@/features/order/api";
import { shopApi } from "@/features/shop/api";
import { OrderList } from "@/features/order/types";
import { FlowerOrderStats } from "@/features/shop/types";
import { OrderStatus } from "@/shared/types";
import {
  Container,
  Header,
  Title,
  Subtitle,
  SectionGrid,
  Card,
  CardHeader,
  MoreButton,
  OrderItem,
  OrderTop,
  OrderBottom,
  OrderNumber,
  StatusBadge,
  Price,
  DateText,
  Empty,
  FlowerItem,
  Rank,
  FlowerInfo,
  FlowerName,
  OrderCount,
  ActionGrid,
  ActionCard,
} from "./ShopDashboardPage.styles";

const ShopDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [recentOrders, setRecentOrders] = useState<OrderList[]>([]);
  const [topFlowers, setTopFlowers] = useState<FlowerOrderStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [ordersRes, flowersRes] = await Promise.all([
        shopOrderAPI.getRecentRequests(0, 8),
        shopApi.getTop5Flowers(),
      ]);

      setRecentOrders(ordersRes.data.content);
      setTopFlowers(flowersRes.data);
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status: OrderStatus) => {
    const map = {
      CREATED: "미결제",
      REQUESTED: "신규주문",
      ACCEPTED: "접수완료",
      READY: "준비완료",
      COMPLETED: "완료",
      CANCELED: "취소됨",
    };
    return map[status];
  };

  if (loading) return <Container>로딩 중...</Container>;

  return (
    <Container>
      <Header>
        <Title>대시보드</Title>
        <Subtitle>가게 운영 현황을 한눈에 확인하세요</Subtitle>
      </Header>

      <SectionGrid>
        {/* 신규 주문 */}
        <Card>
          <CardHeader>
            <h2>신규 주문</h2>
            <MoreButton onClick={() => navigate("/shop/orders")}>
              전체보기 →
            </MoreButton>
          </CardHeader>

          {recentOrders.length === 0 ? (
            <Empty>새로운 주문이 없습니다</Empty>
          ) : (
            recentOrders.map((order) => (
              <OrderItem
                key={order.orderId}
                onClick={() => navigate(`/shop/orders/${order.orderId}`)}
              >
                <OrderTop>
                  <OrderNumber>{order.orderNumber}</OrderNumber>
                  <StatusBadge>{getStatusText(order.status)}</StatusBadge>
                </OrderTop>

                <OrderBottom>
                  <Price>{order.totalPrice.toLocaleString()}원</Price>
                  <DateText>
                    {format(new Date(order.createdAt), "MM/dd HH:mm")}
                  </DateText>
                </OrderBottom>
              </OrderItem>
            ))
          )}
        </Card>

        <Card>
          <CardHeader>
            <h2>인기 꽃 Top 5</h2>
          </CardHeader>

          {topFlowers.length === 0 ? (
            <Empty>통계 데이터가 없습니다</Empty>
          ) : (
            topFlowers.map((flower) => (
              <FlowerItem key={flower.rank}>
                <Rank>{flower.rank}</Rank>
                <FlowerInfo>
                  <FlowerName>{flower.flowerName}</FlowerName>
                  <OrderCount>주문 {flower.orderCount}건</OrderCount>
                </FlowerInfo>
              </FlowerItem>
            ))
          )}
        </Card>
      </SectionGrid>

      <ActionGrid>
        <ActionCard onClick={() => navigate("/shop/orders")}>
          주문 관리
        </ActionCard>
        <ActionCard onClick={() => navigate("/shop/manage")}>
          가게 관리
        </ActionCard>
        <ActionCard onClick={() => navigate("/shop/flowers/manage")}>
          꽃 관리
        </ActionCard>
      </ActionGrid>
    </Container>
  );
};

export default ShopDashboardPage;
