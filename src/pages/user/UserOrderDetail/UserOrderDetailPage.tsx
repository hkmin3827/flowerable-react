import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { userOrderAPI } from "@/features/order/api";
import { OrderDetail } from "@/features/order/types";
import { format } from "date-fns";
import { ArrowLeft, MapPin, Phone } from "lucide-react";
import { OrderStatus } from "@/shared/types";
import { LoadingContainer } from "@/shared/ui/CommonStyles";
import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import { PAYMENT_METHODS, type PaymentMethod } from "@/features/payment/types";
import {
  Container,
  Header,
  BackButton,
  PageTitle,
  Card,
  CardHeader,
  OrderInfo,
  OrderNumber,
  OrderDate,
  StatusBadge,
  SectionTitle,
  InfoGroup,
  InfoItem,
  InfoLabel,
  ItemList,
  OrderItem,
  ItemInfo,
  ItemName,
  ItemQuantity,
  ItemPrice,
  PriceGroup,
  PriceRow,
  PriceLabel,
  TotalRow,
  TotalLabel,
  TotalPrice,
  Message,
  Button,
  DisabledButton,
  PaymentRetryCard,
  PaymentRetryTitle,
  PaymentRetryDesc,
  PaymentMethodList,
  PaymentMethodItem,
  MethodRadio,
  MethodLabel,
  MethodDesc,
  PayButton,
} from "./UserOrderDetailPage.styles";

const TOSS_CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY;

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

      const commonOptions = {
        amount: { currency: "KRW" as const, value: order.totalPrice },
        orderId: order.orderNumber,
        orderName: `${order.shopName} 꽃 주문`,
        successUrl: `${window.location.origin}/payment/success?dbOrderId=${order.orderId}`,
        failUrl: `${window.location.origin}/payment/fail`,
      };

      if (selectedMethod === "CARD") {
        await payment.requestPayment({
          method: "CARD",
          ...commonOptions,
        });
      } else if (selectedMethod === "TRANSFER") {
        await payment.requestPayment({
          method: "TRANSFER",
          ...commonOptions,
        });
      } else {
        await payment.requestPayment({
          method: "VIRTUAL_ACCOUNT",
          ...commonOptions,
        });
      }
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
