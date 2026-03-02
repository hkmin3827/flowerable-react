import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { shopOrderAPI } from "@/features/order/api";
import { OrderDetail } from "@/features/order/types";
import { format } from "date-fns";
import { ArrowLeft, Calendar, Mail, Phone, User, X } from "lucide-react";
import { OrderStatus } from "@/shared/types";
import {
  LoadingContainer,
  ModalOverlay,
  ModalContent,
} from "@/shared/ui/CommonStyles";
import { useQuery } from "@tanstack/react-query";
import { userAPI } from "@/features/user/api";
import { extractErrorMessage } from "@/shared/utils/errorHandler";
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
  ButtonGroup,
  Button,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ProfileButton,
  ReasonGrid,
  ReasonButton,
  ModalFooter,
  ModalButton,
  UserStatusBadge,
  UserAccountStatusBadge,
} from "./ShopOrderDetailPage.styles";

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
  const [showUserModal, setShowUserModal] = useState(false);
  const userId = order?.userId;

  const { data: userProfile, isLoading: userLoading } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => userAPI.getUserProfile(userId!).then((res) => res.data),
    enabled: showUserModal && !!userId,
    staleTime: 1000 * 60 * 5,
  });

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
      alert(extractErrorMessage(error));
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
      alert(extractErrorMessage(error));
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
      alert(extractErrorMessage(error));
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
      alert(extractErrorMessage(error));
    } finally {
      setProcessing(false);
    }
  };
  const handleOpenUserModal = () => {
    if (!order?.userId) return;
    setShowUserModal(true);
  };

  const getStatusText = (status: OrderStatus) => {
    const statusMap = {
      CREATED: "결제 미완료",
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
          <SectionTitle>
            고객 정보{" "}
            <ProfileButton onClick={handleOpenUserModal}>
              상세보기
            </ProfileButton>
          </SectionTitle>

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

        <Card>
          <SectionTitle>요청사항</SectionTitle>
          {order.message ? (
            <Message>{order.message}</Message>
          ) : (
            <Message>-</Message>
          )}
        </Card>
        {order.status === "CANCELED" && (
          <Card>
            <SectionTitle>취소자</SectionTitle>
            <p style={{ marginBottom: "20px" }}>{order.cancelBy}</p>
            <hr />
            <SectionTitle>취소 사유</SectionTitle>
            <p>{order.cancelReason}</p>
          </Card>
        )}
        <ButtonGroup>
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
      {showUserModal && (
        <ModalOverlay onClick={() => setShowUserModal(false)}>
          <ModalContent width="32rem" onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>고객 상세 정보</ModalTitle>
              <CloseButton onClick={() => setShowUserModal(false)}>
                <X size={24} />
              </CloseButton>
            </ModalHeader>

            {userLoading ? (
              <LoadingContainer>로딩 중...</LoadingContainer>
            ) : userProfile ? (
              <InfoGroup>
                <InfoItem>
                  <User size={20} />
                  <InfoLabel>이름</InfoLabel>
                  <span>{userProfile.name}</span>
                </InfoItem>

                <InfoItem>
                  <Mail size={20} />
                  <InfoLabel>이메일</InfoLabel>
                  <span>{userProfile.email}</span>
                </InfoItem>

                <InfoItem>
                  <Phone size={20} />
                  <InfoLabel>전화번호</InfoLabel>
                  <span>{userProfile.telnum}</span>
                </InfoItem>

                <InfoItem>
                  <Calendar size={20} />
                  <InfoLabel>가입일</InfoLabel>
                  <span>
                    {format(
                      new Date(userProfile.createdAt),
                      "yyyy년 MM월 dd일",
                    )}
                  </span>
                </InfoItem>

                <InfoItem>
                  <InfoLabel>계정 상태</InfoLabel>
                  <UserAccountStatusBadge $status={userProfile.accountStatus}>
                    {userProfile.accountStatus === "ACTIVE" && "활성"}
                    {userProfile.accountStatus === "SUSPENDED" && "정지"}
                    {userProfile.accountStatus === "DELETED" && "탈퇴"}
                  </UserAccountStatusBadge>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>활동 가능 여부</InfoLabel>
                  <UserStatusBadge $active={userProfile.active}>
                    {userProfile.active ? "활성" : "제한"}
                  </UserStatusBadge>
                </InfoItem>
              </InfoGroup>
            ) : (
              <LoadingContainer>정보 없음</LoadingContainer>
            )}
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default ShopOrderDetailPage;
