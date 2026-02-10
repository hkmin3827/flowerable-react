import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { orderApi } from "@/features/order/api";
import { OrderDetailResponse } from "@/features/order/types";
import { OrderStatus, Color } from "@/shared/types";

export const OrderDetailPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetail(parseInt(orderId));
    }
  }, [orderId]);

  const fetchOrderDetail = async (id: number) => {
    setIsLoading(true);
    try {
      const response = await orderApi.getOrderDetail(id);
      setOrder(response);
    } catch (error) {
      console.error("주문 상세 조회 실패:", error);
      alert("주문 정보를 불러오는데 실패했습니다.");
      navigate("/orders");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!orderId || !order) return;

    if (order.status !== "PENDING" && order.status !== "CONFIRMED") {
      alert("진행 중이거나 완료된 주문은 취소할 수 없습니다.");
      return;
    }

    if (!confirm("정말 이 주문을 취소하시겠습니까?")) {
      return;
    }

    setIsCancelling(true);
    try {
      await orderApi.cancelOrder(parseInt(orderId));
      alert("주문이 취소되었습니다.");
      fetchOrderDetail(parseInt(orderId));
    } catch (error) {
      console.error("주문 취소 실패:", error);
      alert("주문 취소에 실패했습니다.");
    } finally {
      setIsCancelling(false);
    }
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

  const getColorLabel = (color: Color): string => {
    const labels: Record<Color, string> = {
      RED: "빨강",
      PINK: "분홍",
      WHITE: "흰색",
      YELLOW: "노랑",
      PURPLE: "보라",
      BLUE: "파랑",
      ORANGE: "주황",
      GREEN: "초록",
      MIXED: "혼합",
    };
    return labels[color] || color;
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

  if (isLoading) {
    return (
      <Container>
        <LoadingContainer>
          <Spinner />
          <LoadingText>주문 정보를 불러오는 중...</LoadingText>
        </LoadingContainer>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container>
        <EmptyContainer>
          <EmptyText>주문 정보를 찾을 수 없습니다.</EmptyText>
          <BackButton onClick={() => navigate("/orders")}>
            주문 목록으로 돌아가기
          </BackButton>
        </EmptyContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate("/orders")}>← 목록으로</BackButton>
        <Title>주문 상세</Title>
      </Header>

      <OrderCard>
        <OrderHeader>
          <OrderNumber>주문번호: {order.orderId}</OrderNumber>
          <StatusBadge $color={getStatusColor(order.status)}>
            {getStatusLabel(order.status)}
          </StatusBadge>
        </OrderHeader>

        <Section>
          <SectionTitle>주문 정보</SectionTitle>
          <InfoGrid>
            <InfoItem>
              <Label>주문일시</Label>
              <Value>{formatDate(order.createdAt)}</Value>
            </InfoItem>
            {order.canceledAt && (
              <InfoItem>
                <Label>취소일시</Label>
                <Value>{formatDate(order.canceledAt)}</Value>
              </InfoItem>
            )}
            {order.wrappingColorName && (
              <InfoItem>
                <Label>포장 색상</Label>
                <Value>{order.wrappingColorName}</Value>
              </InfoItem>
            )}
            {order.message && (
              <InfoItem $fullWidth>
                <Label>메시지</Label>
                <Value>{order.message}</Value>
              </InfoItem>
            )}
          </InfoGrid>
        </Section>

        <Section>
          <SectionTitle>주문 상품</SectionTitle>
          <ItemList>
            {order.items.map((item, index) => (
              <ItemCard key={index}>
                <ItemInfo>
                  <ItemName>{item.flowerName}</ItemName>
                  <ItemMeta>
                    <ColorBadge>{getColorLabel(item.flowerColor)}</ColorBadge>
                    <Quantity>수량: {item.quantity}개</Quantity>
                  </ItemMeta>
                </ItemInfo>
                <ItemPrice>{formatPrice(item.itemTotalPrice)}원</ItemPrice>
              </ItemCard>
            ))}
          </ItemList>
        </Section>

        <Section>
          <SectionTitle>결제 정보</SectionTitle>
          <PriceGrid>
            <PriceRow>
              <PriceLabel>꽃 금액</PriceLabel>
              <PriceValue>{formatPrice(order.totalFlowerPrice)}원</PriceValue>
            </PriceRow>
            {order.wrappingExtraPrice > 0 && (
              <PriceRow>
                <PriceLabel>포장 추가 금액</PriceLabel>
                <PriceValue>
                  {formatPrice(order.wrappingExtraPrice)}원
                </PriceValue>
              </PriceRow>
            )}
            <Divider />
            <PriceRow $total>
              <PriceLabel>총 결제 금액</PriceLabel>
              <PriceValue>{formatPrice(order.totalPrice)}원</PriceValue>
            </PriceRow>
          </PriceGrid>
        </Section>

        {(order.status === "PENDING" || order.status === "CONFIRMED") && (
          <ActionSection>
            <CancelButton onClick={handleCancelOrder} disabled={isCancelling}>
              {isCancelling ? "취소 처리 중..." : "주문 취소"}
            </CancelButton>
          </ActionSection>
        )}
      </OrderCard>
    </Container>
  );
};

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin-top: 1rem;
`;

const BackButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #e5e7eb;
  }
`;

const OrderCard = styled.div`
  background: white;
  border-radius: 0.5rem;
  padding: 2rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #e5e7eb;
`;

const OrderNumber = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
`;

const StatusBadge = styled.span<{ $color: string }>`
  display: inline-block;
  padding: 0.375rem 1rem;
  background-color: ${(props) => props.$color}20;
  color: ${(props) => props.$color};
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
`;

const Section = styled.div`
  margin-bottom: 2rem;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1rem;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const InfoItem = styled.div<{ $fullWidth?: boolean }>`
  ${(props) => props.$fullWidth && "grid-column: 1 / -1;"}
`;

const Label = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
`;

const Value = styled.div`
  font-size: 1rem;
  color: #111827;
  font-weight: 500;
`;

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ItemCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 0.375rem;
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
`;

const ItemMeta = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
`;

const ColorBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background-color: #e0e7ff;
  color: #4f46e5;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
`;

const Quantity = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
`;

const ItemPrice = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
`;

const PriceGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const PriceRow = styled.div<{ $total?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${(props) =>
    props.$total &&
    `
    padding-top: 0.75rem;
    font-size: 1.125rem;
    font-weight: 700;
  `}
`;

const PriceLabel = styled.span`
  color: #6b7280;
`;

const PriceValue = styled.span`
  color: #111827;
  font-weight: 600;
`;

const Divider = styled.div`
  height: 1px;
  background-color: #e5e7eb;
  margin: 0.5rem 0;
`;

const ActionSection = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
`;

const CancelButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: #dc2626;
  }

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
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
