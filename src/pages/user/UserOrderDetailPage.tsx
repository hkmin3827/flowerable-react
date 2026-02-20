import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { userOrderAPI } from "@/features/order/api";
import { OrderDetail } from "@/features/order/types";
import { format } from "date-fns";
import { ArrowLeft, MapPin, Phone } from "lucide-react";
import { OrderStatus } from "@/shared/types";
import { colors, LoadingContainer } from "@/shared/ui/CommonStyles";
import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import { PAYMENT_METHODS, type PaymentMethod } from "@/features/payment/types";

const TOSS_CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY;

// ─────────────────────────────────────────────────────────────
// Styled Components
// ─────────────────────────────────────────────────────────────

const Container = styled.div`
  max-width: 64rem;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  padding: 0.5rem;
  border: none;
  background: transparent;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: ${colors.background};
  }
`;

const PageTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: bold;
  color: ${colors.text};
`;

const Card = styled.div`
  background: ${colors.white};
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 1rem;
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

const OrderDate = styled.p`
  font-size: 0.875rem;
  color: ${colors.textSecondary};
`;

const StatusBadge = styled.span<{ status: OrderStatus }>`
  display: inline-block;
  padding: 0.375rem 0.875rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;

  ${({ status }) => {
    switch (status) {
      case "CREATED":
        return `background: #FEF3C7; color: #D97706;`;
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

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  color: ${colors.text};
  margin-bottom: 1rem;
`;

const InfoGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${colors.textSecondary};
`;

const InfoLabel = styled.span`
  font-weight: 500;
  color: ${colors.text};
`;

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${colors.border};

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const ItemName = styled.p`
  font-weight: 500;
  color: ${colors.text};
`;

const ItemQuantity = styled.p`
  font-size: 0.875rem;
  color: ${colors.textSecondary};
`;

const ItemPrice = styled.p`
  font-weight: bold;
  color: ${colors.text};
`;

const PriceGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PriceLabel = styled.span`
  color: ${colors.textSecondary};
`;

const TotalRow = styled(PriceRow)`
  border-top: 1px solid ${colors.border};
  padding-top: 0.75rem;
  margin-top: 0.5rem;
`;

const TotalLabel = styled.span`
  font-size: 1.125rem;
  font-weight: bold;
  color: ${colors.text};
`;

const TotalPrice = styled.span`
  font-size: 1.125rem;
  font-weight: bold;
  color: ${colors.primary};
`;

const Message = styled.p`
  color: ${colors.textSecondary};
  line-height: 1.6;
`;

const Button = styled.button`
  width: 100%;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  background: ${colors.error};
  color: ${colors.white};

  &:hover:not(:disabled) {
    background: #dc2626;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const DisabledButton = styled(Button)`
  background: ${colors.border};
  color: ${colors.textSecondary};
  cursor: not-allowed;

  &:hover {
    background: ${colors.border};
  }
`;

const PaymentRetryCard = styled(Card)`
  border: 2px dashed #f59e0b;
  background: #fffbeb;
`;

const PaymentRetryTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 700;
  color: #92400e;
  margin-bottom: 0.5rem;
`;

const PaymentRetryDesc = styled.p`
  font-size: 0.875rem;
  color: #b45309;
  margin-bottom: 1.25rem;
  line-height: 1.5;
`;

const PaymentMethodList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
`;

const PaymentMethodItem = styled.div<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: 2px solid ${(p) => (p.$selected ? "#3b63f2" : "#e5e7eb")};
  border-radius: 0.5rem;
  cursor: pointer;
  background: ${(p) => (p.$selected ? "#f3f5ff" : "white")};
  transition: all 0.2s;

  &:hover {
    border-color: #3b63f2;
  }
`;

const MethodRadio = styled.div<{ $selected: boolean }>`
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  border: 2px solid ${(p) => (p.$selected ? "#3b63f2" : "#d1d5db")};
  background: ${(p) => (p.$selected ? "#3b63f2" : "white")};
  flex-shrink: 0;
  transition: all 0.2s;
`;

const MethodLabel = styled.span`
  font-weight: 600;
  color: #111827;
  font-size: 0.875rem;
`;

const MethodDesc = styled.span`
  color: #6b7280;
  font-size: 0.75rem;
  margin-left: 0.25rem;
`;

const PayButton = styled.button`
  width: 100%;
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #3b63f2, #294ccc);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const UserOrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [paying, setPaying] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("CARD");

  useEffect(() => {
    if (orderId) fetchOrderDetail();
  }, [orderId]);

  const fetchOrderDetail = async () => {
    try {
      const response = await userOrderAPI.getOrderDetail(Number(orderId));
      setOrder(response.data);
    } catch (error) {
      console.error("Failed to fetch order detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order || !window.confirm("정말 주문을 취소하시겠습니까?")) return;

    setCancelling(true);
    try {
      await userOrderAPI.cancelOrder(order.orderId);
      alert("주문이 취소되었습니다.");
      fetchOrderDetail();
    } catch (error) {
      console.error("Failed to cancel order:", error);
      alert("주문 취소에 실패했습니다.");
    } finally {
      setCancelling(false);
    }
  };

  const handleRetryPayment = async () => {
    if (!order || paying) return;
    setPaying(true);

    try {
      const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY);
      const payment = tossPayments.payment({ customerKey: ANONYMOUS });

      await payment.requestPayment({
        method:
          selectedMethod === "CARD"
            ? "CARD"
            : selectedMethod === "TRANSFER"
              ? "TRANSFER"
              : "VIRTUAL_ACCOUNT",
        amount: { currency: "KRW", value: order.totalPrice },
        orderId: order.orderNumber,
        orderName: `${order.shopName} 꽃 주문`,
        successUrl: `${window.location.origin}/payment/success?dbOrderId=${order.orderId}`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } catch (error: any) {
      if (error?.code !== "USER_CANCEL") {
        alert(error?.message || "결제 처리 중 오류가 발생했습니다.");
      }
      setPaying(false);
    }
  };

  const getStatusText = (status: OrderStatus) => {
    const statusMap: Record<OrderStatus, string> = {
      CREATED: "결제 미완료",
      REQUESTED: "주문요청",
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

  if (!order) {
    return (
      <Container>
        <LoadingContainer>주문을 찾을 수 없습니다</LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate("/orders")}>
          <ArrowLeft size={24} />
        </BackButton>
        <PageTitle>주문 상세</PageTitle>
      </Header>

      {order.status === "CREATED" && (
        <PaymentRetryCard>
          <PaymentRetryTitle>
            ⚠️ 결제가 완료되지 않은 주문입니다
          </PaymentRetryTitle>
          <PaymentRetryDesc>
            결제를 완료해야 주문이 접수됩니다. 결제 수단을 선택하고 아래 버튼을
            눌러 결제를 진행해주세요.
          </PaymentRetryDesc>

          <PaymentMethodList>
            {PAYMENT_METHODS.map((method) => (
              <PaymentMethodItem
                key={method.value}
                $selected={selectedMethod === method.value}
                onClick={() => setSelectedMethod(method.value)}
              >
                <MethodRadio $selected={selectedMethod === method.value} />
                <div>
                  <MethodLabel>{method.label}</MethodLabel>
                  <MethodDesc>· {method.description}</MethodDesc>
                </div>
              </PaymentMethodItem>
            ))}
          </PaymentMethodList>

          <PayButton onClick={handleRetryPayment} disabled={paying}>
            {paying
              ? "결제 처리 중..."
              : `${order.totalPrice.toLocaleString()}원 결제하기`}
          </PayButton>
        </PaymentRetryCard>
      )}

      <Card>
        <CardHeader>
          <OrderInfo>
            <OrderNumber>주문번호: {order.orderNumber}</OrderNumber>
            <OrderDate>
              {format(new Date(order.createdAt), "yyyy년 MM월 dd일 HH:mm")}
            </OrderDate>
          </OrderInfo>
          <StatusBadge status={order.status}>
            {getStatusText(order.status)}
          </StatusBadge>
        </CardHeader>
      </Card>

      <Card>
        <SectionTitle>가게 정보</SectionTitle>
        <InfoGroup>
          <InfoItem>
            <InfoLabel>가게명 : {order.shopName}</InfoLabel>
          </InfoItem>
          <InfoItem>
            <MapPin size={20} />
            <InfoLabel>{order.shopAddress}</InfoLabel>
          </InfoItem>
          <InfoItem>
            <Phone size={20} />
            <InfoLabel>{order.opponentTelnum}</InfoLabel>
          </InfoItem>
        </InfoGroup>
      </Card>

      <Card>
        <SectionTitle>주문 상품</SectionTitle>
        <ItemList>
          {(order.items ?? []).map((item, index) => (
            <OrderItem key={index}>
              <ItemInfo>
                <ItemName>{item.flowerName}</ItemName>
                <ItemQuantity>{item.quantity}개</ItemQuantity>
              </ItemInfo>
              <ItemPrice>{item.itemTotalPrice.toLocaleString()}원</ItemPrice>
            </OrderItem>
          ))}
        </ItemList>
      </Card>

      <Card>
        <SectionTitle>결제 정보</SectionTitle>
        <PriceGroup>
          <PriceRow>
            <PriceLabel>상품 금액</PriceLabel>
            <span>{order.totalFlowerPrice.toLocaleString()}원</span>
          </PriceRow>
          {order.wrappingColorName && (
            <PriceRow>
              <PriceLabel>포장 ({order.wrappingColorName})</PriceLabel>
              <span>{order.wrappingExtraPrice.toLocaleString()}원</span>
            </PriceRow>
          )}
          <TotalRow>
            <TotalLabel>총 금액</TotalLabel>
            <TotalPrice>{order.totalPrice.toLocaleString()}원</TotalPrice>
          </TotalRow>
        </PriceGroup>
      </Card>

      {order.message && (
        <Card>
          <SectionTitle>요청사항</SectionTitle>
          <Message>{order.message}</Message>
        </Card>
      )}

      {order.status === "CANCELED" && (
        <Card>
          <SectionTitle>취소자</SectionTitle>
          <p style={{ marginBottom: "20px" }}>{order.cancelBy}</p>
          <hr />
          <SectionTitle>취소 사유</SectionTitle>
          <p>{order.cancelReason}</p>
        </Card>
      )}

      {order.status === "REQUESTED" ? (
        <Button onClick={handleCancelOrder} disabled={cancelling}>
          {cancelling ? "취소 중..." : "주문 취소"}
        </Button>
      ) : order.status !== "CREATED" ? (
        <DisabledButton disabled>취소 불가</DisabledButton>
      ) : null}
    </Container>
  );
};

export default UserOrderDetailPage;
