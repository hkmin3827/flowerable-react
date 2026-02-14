import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { shopOrderAPI } from "@/features/order/api";
import { OrderDetail } from "@/features/order/types";
import { format } from "date-fns";
import { ArrowLeft, Phone, User, X } from "lucide-react";
import { OrderStatus } from "@/shared/types";
import {
  colors,
  LoadingContainer,
  ModalOverlay,
  ModalContent,
} from "@/shared/ui/CommonStyles";

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

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Button = styled.button<{
  variant?: "primary" | "success" | "error" | "info";
}>`
  width: 100%;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;

  ${({ variant = "primary" }) => {
    switch (variant) {
      case "success":
        return `
          background: ${colors.success};
          color: ${colors.white};
          &:hover:not(:disabled) {
            background: #059669;
          }
        `;
      case "info":
        return `
          background: ${colors.info};
          color: ${colors.white};
          &:hover:not(:disabled) {
            background: #2563EB;
          }
        `;
      case "error":
        return `
          background: ${colors.error};
          color: ${colors.white};
          &:hover:not(:disabled) {
            background: #DC2626;
          }
        `;
      default:
        return `
          background: ${colors.primary};
          color: ${colors.white};
          &:hover:not(:disabled) {
            background: ${colors.primaryHover};
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: bold;
  color: ${colors.text};
`;

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

const ReasonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.5rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const ReasonButton = styled.button<{ selected?: boolean }>`
  padding: 1rem;
  border: 2px solid
    ${({ selected }) => (selected ? colors.primary : colors.border)};
  background: ${({ selected }) =>
    selected ? colors.primaryLight : colors.white};
  color: ${colors.text};
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;

  &:hover {
    border-color: ${colors.primary};
    background: ${colors.primaryLight};
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;

const ModalButton = styled.button<{ variant?: "primary" | "secondary" }>`
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  ${({ variant = "primary" }) =>
    variant === "primary"
      ? `
    background: ${colors.error};
    color: ${colors.white};
    &:hover:not(:disabled) {
      background: #DC2626;
    }
  `
      : `
    background: ${colors.background};
    color: ${colors.text};
    &:hover:not(:disabled) {
      background: #E5E7EB;
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CANCEL_REASONS = [
  { value: "OUT_OF_STOCK", label: "재고 부족" },
  { value: "CUSTOMER_REQUEST", label: "주문자 요청" },
  { value: "CANNOT_FULFILL_REQUEST", label: "요청 사항 어려움" },
  { value: "SHOP_CLOSED", label: "영업 종료 / 임시 휴무" },
  { value: "PRICE_ERROR", label: "가격 오류" },
  { value: "OTHER", label: "가게 사정" },
];

const ShopOrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");

  useEffect(() => {
    if (orderId) {
      fetchOrderDetail();
    }
  }, [orderId]);

  const fetchOrderDetail = async () => {
    try {
      const response = await shopOrderAPI.getOrderDetail(Number(orderId));
      setOrder(response.data);
    } catch (error) {
      console.error("Failed to fetch order detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOrder = async () => {
    if (!order || !window.confirm("주문을 접수하시겠습니까?")) return;

    setProcessing(true);
    try {
      await shopOrderAPI.changeStatus(order.orderId, "ACCEPTED");
      alert("주문이 접수되었습니다.");
      fetchOrderDetail();
    } catch (error) {
      console.error("Failed to accept order:", error);
      alert("주문 접수에 실패했습니다.");
    } finally {
      setProcessing(false);
    }
  };

  const handleReadyOrder = async () => {
    if (!order || !window.confirm("주문 준비가 완료되었습니까?")) return;

    setProcessing(true);
    try {
      await shopOrderAPI.changeStatus(order.orderId, "READY");
      alert("주문 준비가 완료되었습니다.");
      fetchOrderDetail();
    } catch (error) {
      console.error("Failed to ready order:", error);
      alert("상태 변경에 실패했습니다.");
    } finally {
      setProcessing(false);
    }
  };

  const handleCompleteOrder = async () => {
    if (!order || !window.confirm("주문을 완료 처리하시겠습니까?")) return;

    setProcessing(true);
    try {
      await shopOrderAPI.changeStatus(order.orderId, "COMPLETED");
      alert("주문이 완료되었습니다.");
      fetchOrderDetail();
    } catch (error) {
      console.error("Failed to complete order:", error);
      alert("주문 완료에 실패했습니다.");
    } finally {
      setProcessing(false);
    }
  };

  const handleOpenCancelModal = () => {
    setShowCancelModal(true);
    setSelectedReason("");
  };

  const handleCloseCancelModal = () => {
    setShowCancelModal(false);
    setSelectedReason("");
  };

  const handleSubmitCancel = async () => {
    if (!order || !selectedReason) {
      alert("취소 사유를 선택해주세요.");
      return;
    }

    setProcessing(true);
    try {
      await shopOrderAPI.changeStatus(
        order.orderId,
        "CANCELED",
        selectedReason,
      );
      alert("주문이 취소되었습니다.");
      setShowCancelModal(false);
      fetchOrderDetail();
    } catch (error) {
      console.error("Failed to cancel order:", error);
      alert("주문 취소에 실패했습니다.");
    } finally {
      setProcessing(false);
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

  if (!order) {
    return (
      <Container>
        <LoadingContainer>주문을 찾을 수 없습니다</LoadingContainer>
      </Container>
    );
  }

  return (
    <>
      <Container>
        <Header>
          <BackButton onClick={() => navigate("/shop/orders")}>
            <ArrowLeft size={24} />
          </BackButton>
          <PageTitle>주문 상세</PageTitle>
        </Header>

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
          <SectionTitle>고객 정보</SectionTitle>
          <InfoGroup>
            <InfoItem>
              <User size={20} />
              <InfoLabel>{order.userName}</InfoLabel>
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
                  <ItemQuantity>
                    {item.flowerBasePrice}원 * {item.quantity}개
                  </ItemQuantity>
                </ItemInfo>
                <ItemPrice>{item.itemTotalPrice}원</ItemPrice>
              </OrderItem>
            ))}
          </ItemList>
        </Card>

        <Card>
          <SectionTitle>결제 정보</SectionTitle>
          <PriceGroup>
            <PriceRow>
              <PriceLabel>상품 금액</PriceLabel>
              <span>{order.totalFlowerPrice}원</span>
            </PriceRow>
            {order.wrappingColorName && (
              <PriceRow>
                <PriceLabel>포장 ({order.wrappingColorName})</PriceLabel>
                <span>{order.wrappingExtraPrice}원</span>
              </PriceRow>
            )}
            <TotalRow>
              <TotalLabel>총 금액</TotalLabel>
              <TotalPrice>{order.totalPrice}원</TotalPrice>
            </TotalRow>
          </PriceGroup>
        </Card>

        {order.message && (
          <Card>
            <SectionTitle>요청사항</SectionTitle>
            <Message>{order.message}</Message>
          </Card>
        )}

        <ButtonGroup>
          {/* REQUESTED: 접수 / 취소 */}
          {order.status === "REQUESTED" && (
            <>
              <Button
                variant="info"
                onClick={handleAcceptOrder}
                disabled={processing}
              >
                {processing ? "처리 중..." : "주문 접수"}
              </Button>
              <Button
                variant="error"
                onClick={handleOpenCancelModal}
                disabled={processing}
              >
                주문 취소
              </Button>
            </>
          )}

          {/* ACCEPTED: 준비완료 / 취소 */}
          {order.status === "ACCEPTED" && (
            <>
              <Button
                variant="success"
                onClick={handleReadyOrder}
                disabled={processing}
              >
                {processing ? "처리 중..." : "준비 완료"}
              </Button>
              <Button
                variant="error"
                onClick={handleOpenCancelModal}
                disabled={processing}
              >
                주문 취소
              </Button>
            </>
          )}

          {/* READY: 완료 / 취소 */}
          {order.status === "READY" && (
            <>
              <Button
                variant="primary"
                onClick={handleCompleteOrder}
                disabled={processing}
              >
                {processing ? "처리 중..." : "완료"}
              </Button>
              <Button
                variant="error"
                onClick={handleOpenCancelModal}
                disabled={processing}
              >
                주문 취소
              </Button>
            </>
          )}

          {/* COMPLETED / CANCELED: 버튼 없음 */}
        </ButtonGroup>
      </Container>

      {showCancelModal && (
        <ModalOverlay onClick={handleCloseCancelModal}>
          <ModalContent width="36rem" onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>주문 취소 사유 선택</ModalTitle>
              <CloseButton onClick={handleCloseCancelModal}>
                <X size={24} />
              </CloseButton>
            </ModalHeader>

            <ReasonGrid>
              {CANCEL_REASONS.map((reason) => (
                <ReasonButton
                  key={reason.value}
                  selected={selectedReason === reason.value}
                  onClick={() => setSelectedReason(reason.value)}
                >
                  {reason.label}
                </ReasonButton>
              ))}
            </ReasonGrid>

            <ModalFooter>
              <ModalButton variant="secondary" onClick={handleCloseCancelModal}>
                닫기
              </ModalButton>
              <ModalButton
                variant="primary"
                onClick={handleSubmitCancel}
                disabled={!selectedReason || processing}
              >
                {processing ? "처리 중..." : "취소하기"}
              </ModalButton>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default ShopOrderDetailPage;
