import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { format } from "date-fns";
import { shopOrderAPI } from "@/features/order/api";
import { shopApi } from "@/features/shop/api";
import { OrderList } from "@/features/order/types";
import { FlowerOrderStats } from "@/features/shop/types";
import { OrderStatus } from "@/shared/types";

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

        {/* 인기 꽃 */}
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

        <ActionCard onClick={() => navigate("/shop/flowers/manage")}>
          꽃 관리
        </ActionCard>

        <ActionCard onClick={() => navigate("/shop/settings")}>
          가게 설정
        </ActionCard>
      </ActionGrid>
    </Container>
  );
};

export default ShopDashboardPage;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 1rem;
`;

const Header = styled.div`
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #111827;
`;

const Subtitle = styled.p`
  color: #6b7280;
  margin-top: 0.5rem;
`;

const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;

  h2 {
    font-size: 1.25rem;
    font-weight: 600;
  }
`;

const MoreButton = styled.button`
  background: none;
  border: none;
  color: #3b82f6;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const OrderItem = styled.div`
  padding: 1rem 0;
  border-top: 1px solid #f3f4f6;
  cursor: pointer;

  &:hover {
    background: #f9fafb;
  }
`;

const OrderTop = styled.div`
  display: flex;
  justify-content: space-between;
`;

const OrderBottom = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
`;

const OrderNumber = styled.span`
  font-size: 0.9rem;
  color: #6b7280;
`;

const StatusBadge = styled.span`
  font-size: 0.75rem;
  background: #fee2e2;
  color: #991b1b;
  padding: 0.25rem 0.5rem;
  border-radius: 999px;
`;

const Price = styled.span`
  font-weight: 600;
  color: #ed8003;
`;

const DateText = styled.span`
  font-size: 0.75rem;
  color: #9ca3af;
`;

const Empty = styled.div`
  text-align: center;
  padding: 2rem 0;
  color: #9ca3af;
`;

const FlowerItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 0;
  border-top: 1px solid #f3f4f6;
`;

const Rank = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  width: 40px;
`;

const FlowerInfo = styled.div`
  flex: 1;
`;

const FlowerName = styled.div`
  font-weight: 600;
`;

const OrderCount = styled.div`
  font-size: 0.85rem;
  color: #6b7280;
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-top: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ActionCard = styled.button`
  padding: 1.5rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background: #f9fafb;
  }
`;
