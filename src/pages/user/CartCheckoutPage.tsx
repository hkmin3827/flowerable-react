import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { axiosInstance } from "@/shared/api/axios";
import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import { cartApi } from "@/features/cart/api";
import { PAYMENT_METHODS, type PaymentMethod } from "@/features/payment/types";
import type { CartItemInfo } from "@/features/cart/types";

const TOSS_CLIENT_KEY =
  import.meta.env.VITE_TOSS_CLIENT_KEY ||
  "test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq";

const CartCheckoutPage = () => {
  const { cartItemId } = useParams<{ cartItemId: string }>();
  const navigate = useNavigate();

  const [cartItem, setCartItem] = useState<CartItemInfo | null>(null);
  const [wrappingOptions, setWrappingOptions] = useState<{
    colorNames: string[];
    price: number;
  } | null>(null);
  const [selectedWrapping, setSelectedWrapping] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("CARD");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCartItem();
  }, [cartItemId]);

  const loadCartItem = async () => {
    try {
      const cart = await cartApi.getCart();
      const item = cart.items.find((i) => i.cartItemId === Number(cartItemId));
      if (!item) {
        alert("장바구니 항목을 찾을 수 없습니다.");
        navigate("/cart");
        return;
      }
      setCartItem(item);
      setSelectedWrapping(item.wrappingColorName ?? null);
      setMessage(item.message ?? "");

      // 포장 옵션 로드
      const res = await axiosInstance.get(
        `/orders/users/${item.shopId}/wrapping-options`,
      );
      setWrappingOptions(res.data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const flowerTotal = cartItem?.totalFlowerPrice ?? 0;
  const wrappingPrice =
    selectedWrapping && wrappingOptions ? wrappingOptions.price : 0;
  const totalPrice = flowerTotal + wrappingPrice;

  const handlePayment = async () => {
    if (!cartItem || submitting) return;
    setSubmitting(true);

    try {
      // 1. 주문 생성
      const orderRes = await axiosInstance.post(
        `/orders/users/${cartItem.shopId}`,
        {
          orderItems: cartItem.flowers.map((f) => ({
            shopFlowerId: f.shopFlowerId,
            quantity: f.quantity,
            flowerColor: f.flowerColor,
          })),
          wrappingColorName: selectedWrapping ?? null,
          wrappingExtraPrice: selectedWrapping
            ? (wrappingOptions?.price ?? 0)
            : 0,
          message: message.trim() || null,
        },
      );

      const {
        orderId: dbOrderId,
        orderNumber,
        totalPrice: confirmTotal,
      } = orderRes.data;

      // 2. 카트 아이템 삭제
      try {
        await cartApi.removeCartItem(cartItem.cartItemId);
      } catch {
        /* ignore */
      }

      // 3. 토스 결제
      const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY);
      const payment = tossPayments.payment({ customerKey: ANONYMOUS });

      await payment.requestPayment({
        method:
          selectedMethod === "CARD"
            ? "CARD"
            : selectedMethod === "TRANSFER"
              ? "TRANSFER"
              : "VIRTUAL_ACCOUNT",
        amount: { currency: "KRW", value: confirmTotal },
        orderId: orderNumber,
        orderName: `${cartItem.shopName} 꽃 주문`,
        successUrl: `${window.location.origin}/payment/success?dbOrderId=${dbOrderId}`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } catch (error: any) {
      if (error?.code !== "USER_CANCEL") {
        alert(
          error?.response?.data?.message || "결제 처리 중 오류가 발생했습니다.",
        );
      }
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <Container>
        <LoadingText>로딩 중...</LoadingText>
      </Container>
    );
  if (!cartItem) return null;

  return (
    <Container>
      <Header>
        <BackBtn onClick={() => navigate("/cart")}>← 장바구니</BackBtn>
        <PageTitle>주문하기</PageTitle>
      </Header>

      {/* 주문 상품 */}
      <Card>
        <CardTitle>🌸 주문 상품 — {cartItem.shopName}</CardTitle>
        {cartItem.flowers.map((f, i) => (
          <ItemRow key={i}>
            <ItemName>
              {f.flowerName} ({f.flowerColor})
            </ItemName>
            <ItemRight>
              <ItemQty>x{f.quantity}</ItemQty>
              <ItemPrice>{f.totalPrice.toLocaleString()}원</ItemPrice>
            </ItemRight>
          </ItemRow>
        ))}
      </Card>

      {/* 포장지 선택 */}
      {wrappingOptions && wrappingOptions.colorNames.length > 0 && (
        <Card>
          <CardTitle>🎀 포장지 선택</CardTitle>
          <WrappingNone
            $selected={!selectedWrapping}
            onClick={() => setSelectedWrapping(null)}
          >
            <WrappingLabel>포장 없음</WrappingLabel>
            <WrappingPrice>+0원</WrappingPrice>
          </WrappingNone>
          <WrappingGrid>
            {wrappingOptions.colorNames.map((color) => (
              <WrappingItem
                key={color}
                $selected={selectedWrapping === color}
                onClick={() => setSelectedWrapping(color)}
              >
                <WrappingLabel>{color}</WrappingLabel>
                <WrappingPrice>
                  +{wrappingOptions.price.toLocaleString()}원
                </WrappingPrice>
              </WrappingItem>
            ))}
          </WrappingGrid>
        </Card>
      )}

      {/* 요청 사항 */}
      <Card>
        <CardTitle>📝 요청 사항</CardTitle>
        <Textarea
          placeholder="요청 사항을 입력해주세요 (선택사항, 최대 100자)"
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, 100))}
          rows={3}
        />
        <CharCount>{message.length}/100</CharCount>
      </Card>

      {/* 결제 수단 */}
      <Card>
        <CardTitle>💳 결제 수단</CardTitle>
        <PaymentMethodList>
          {PAYMENT_METHODS.map((method) => (
            <PaymentMethodItem
              key={method.value}
              $selected={selectedMethod === method.value}
              onClick={() => setSelectedMethod(method.value)}
            >
              <MethodRadio $selected={selectedMethod === method.value} />
              <MethodInfo>
                <MethodLabel>{method.label}</MethodLabel>
                <MethodDesc>{method.description}</MethodDesc>
              </MethodInfo>
              <TossLogo>토스페이먼츠</TossLogo>
            </PaymentMethodItem>
          ))}
        </PaymentMethodList>
      </Card>

      {/* 금액 요약 */}
      <PriceSummary>
        <PriceRow>
          <PriceLabel>꽃 금액</PriceLabel>
          <PriceValue>{flowerTotal.toLocaleString()}원</PriceValue>
        </PriceRow>
        {selectedWrapping && (
          <PriceRow>
            <PriceLabel>포장지 ({selectedWrapping})</PriceLabel>
            <PriceValue>+{wrappingPrice.toLocaleString()}원</PriceValue>
          </PriceRow>
        )}
        <Divider />
        <PriceRow>
          <TotalLabel>총 결제금액</TotalLabel>
          <TotalValue>{totalPrice.toLocaleString()}원</TotalValue>
        </PriceRow>
      </PriceSummary>

      <PayButton onClick={handlePayment} disabled={submitting}>
        {submitting
          ? "처리 중..."
          : `${totalPrice.toLocaleString()}원 결제하기`}
      </PayButton>
    </Container>
  );
};

export default CartCheckoutPage;

/* ─── Styles ─────────────────────────────────────────────── */
const Container = styled.div`
  max-width: 640px;
  margin: 0 auto;
  padding: 1.5rem 1rem 6rem;
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;
const BackBtn = styled.button`
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  cursor: pointer;
  color: #374151;
  font-size: 0.875rem;
  &:hover {
    background: #f3f4f6;
  }
`;
const PageTitle = styled.h1`
  font-size: 1.375rem;
  font-weight: 700;
  color: #111827;
`;
const Card = styled.div`
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  padding: 1.25rem 1.5rem;
  margin-bottom: 1rem;
`;
const CardTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
`;
const ItemRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f3f4f6;
  &:last-child {
    border-bottom: none;
  }
`;
const ItemName = styled.span`
  color: #374151;
  font-size: 0.9rem;
`;
const ItemRight = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
`;
const ItemQty = styled.span`
  color: #9ca3af;
  font-size: 0.875rem;
`;
const ItemPrice = styled.span`
  font-weight: 600;
  color: #111827;
  font-size: 0.9rem;
`;
const WrappingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 0.75rem;
  margin-top: 0.75rem;
`;
const WrappingNone = styled.div<{ $selected: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border: 2px solid ${(p) => (p.$selected ? "#ec4899" : "#e5e7eb")};
  border-radius: 0.5rem;
  cursor: pointer;
  background: ${(p) => (p.$selected ? "#fdf2f8" : "white")};
  transition: all 0.2s;
  margin-bottom: 0.5rem;
`;
const WrappingItem = styled.div<{ $selected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.875rem;
  border: 2px solid ${(p) => (p.$selected ? "#ec4899" : "#e5e7eb")};
  border-radius: 0.5rem;
  cursor: pointer;
  background: ${(p) => (p.$selected ? "#fdf2f8" : "white")};
  transition: all 0.2s;
  text-align: center;
  &:hover {
    border-color: #ec4899;
  }
`;
const WrappingLabel = styled.div`
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
`;
const WrappingPrice = styled.div`
  color: #6b7280;
  font-size: 0.75rem;
  margin-top: 0.25rem;
`;
const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-family: inherit;
  font-size: 0.9rem;
  resize: none;
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-color: #ec4899;
    box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
  }
`;
const CharCount = styled.div`
  text-align: right;
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 0.25rem;
`;
const PaymentMethodList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`;
const PaymentMethodItem = styled.div<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1rem;
  border: 2px solid ${(p) => (p.$selected ? "#ec4899" : "#e5e7eb")};
  border-radius: 0.5rem;
  cursor: pointer;
  background: ${(p) => (p.$selected ? "#fdf2f8" : "white")};
  transition: all 0.2s;
  &:hover {
    border-color: #ec4899;
  }
`;
const MethodRadio = styled.div<{ $selected: boolean }>`
  width: 1.125rem;
  height: 1.125rem;
  border-radius: 50%;
  border: 2px solid ${(p) => (p.$selected ? "#ec4899" : "#d1d5db")};
  background: ${(p) => (p.$selected ? "#ec4899" : "white")};
  flex-shrink: 0;
  transition: all 0.2s;
`;
const MethodInfo = styled.div`
  flex: 1;
`;
const MethodLabel = styled.div`
  font-weight: 600;
  color: #111827;
  font-size: 0.9rem;
`;
const MethodDesc = styled.div`
  color: #6b7280;
  font-size: 0.75rem;
`;
const TossLogo = styled.div`
  font-size: 0.7rem;
  color: #9ca3af;
  background: #f3f4f6;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
`;
const PriceSummary = styled.div`
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  padding: 1.25rem 1.5rem;
  margin-bottom: 1rem;
`;
const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.375rem 0;
`;
const PriceLabel = styled.span`
  color: #6b7280;
  font-size: 0.9rem;
`;
const PriceValue = styled.span`
  color: #374151;
  font-weight: 500;
`;
const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 0.625rem 0;
`;
const TotalLabel = styled.span`
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
`;
const TotalValue = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  color: #ec4899;
`;
const PayButton = styled.button`
  width: 100%;
  padding: 1.125rem;
  background: linear-gradient(135deg, #ec4899, #db2777);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-size: 1.125rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s;
  margin-top: 0.5rem;
  &:hover:not(:disabled) {
    opacity: 0.9;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
const LoadingText = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: 1.125rem;
  color: #6b7280;
`;
