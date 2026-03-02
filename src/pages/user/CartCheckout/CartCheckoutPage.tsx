import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "@/shared/api/axios";
import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import { cartApi } from "@/features/cart/api";
import { PAYMENT_METHODS, type PaymentMethod } from "@/features/payment/types";
import type { CartItemInfo } from "@/features/cart/types";
import {
  Container,
  Header,
  BackBtn,
  PageTitle,
  Card,
  CardTitle,
  ItemRow,
  ItemName,
  ItemRight,
  ItemQty,
  ItemPrice,
  WrappingGrid,
  WrappingItem,
  WrappingLabel,
  WrappingPrice,
  Textarea,
  CharCount,
  PaymentMethodList,
  PaymentMethodItem,
  MethodRadio,
  MethodInfo,
  MethodLabel,
  MethodDesc,
  TossLogo,
  PriceSummary,
  PriceRow,
  PriceLabel,
  PriceValue,
  Divider,
  TotalLabel,
  TotalValue,
  PayButton,
  PreviewSection,
  PreviewHeader,
  PreviewTitle,
  PreviewSubtitle,
  PreviewPlaceholder,
  PlaceholderEmoji,
  PlaceholderText,
  ErrorText,
  PreviewBtn,
  PreviewImageWrap,
  PreviewImage,
  RegenerateBtn,
  LoadingWrap,
  Spinner,
  LoadingText,
} from "./CartCheckoutPage.styles";

const TOSS_CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY;

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
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const generatingRef = useRef(false);

  useEffect(() => {
    loadCartItem();
  }, [cartItemId]);

  useEffect(() => {
    setPreviewImageUrl(null);
    setPreviewError(null);
  }, [selectedWrapping]);

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

      console.log("shopId:", item.shopId);
      const res = await axiosInstance.get(
        `/orders/users/${item.shopId}/wrapping-options`,
      );
      setWrappingOptions(res.data);
    } catch (error) {
      console.error("loadCartItem error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePreview = async () => {
    console.log("🔥 preview click");
    if (generatingRef.current) return;
    generatingRef.current = true;

    setPreviewLoading(true);
    setPreviewError(null);
    setPreviewImageUrl(null);

    try {
      const res = await axiosInstance.post(
        `/orders/users/${cartItem!.shopId}/bouquet-preview`,
        {
          orderItems: cartItem?.flowers.map((f) => ({
            flowerName: f.flowerName,
            flowerColor: f.flowerColor,
            quantity: f.quantity,
          })),
          wrappingColorName: selectedWrapping,
        },
        { timeout: 30000 },
      );
      setPreviewImageUrl(res.data.imageUrl);
    } catch (error: any) {
      console.error("미리보기 에러:", error);
      console.error("status:", error?.response?.status);
      console.error("data:", error?.response?.data);

      setPreviewError(
        error?.response?.data?.message ||
          "미리보기 생성에 실패했습니다. 다시 시도해주세요.",
      );
    } finally {
      setPreviewLoading(false);
      generatingRef.current = false;
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

      try {
        await cartApi.removeCartItem(cartItem.cartItemId);
      } catch {
        /* ignore */
      }

      const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY);
      const payment = tossPayments.payment({ customerKey: ANONYMOUS });
      const commonOptions = {
        amount: { currency: "KRW" as const, value: confirmTotal },
        orderId: orderNumber,
        orderName: `${cartItem.shopName} 꽃 주문`,
        successUrl: `${window.location.origin}/payment/success?dbOrderId=${dbOrderId}`,
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
        // 기본적으로 VIRTUAL_ACCOUNT 처리
        await payment.requestPayment({
          method: "VIRTUAL_ACCOUNT",
          ...commonOptions,
        });
      }
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

      {wrappingOptions && wrappingOptions.colorNames.length > 0 && (
        <Card>
          <CardTitle>🎀 포장지 선택</CardTitle>
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
      {selectedWrapping && (
        <PreviewSection>
          <PreviewHeader>
            <PreviewTitle>🌷 부케 미리보기</PreviewTitle>
            <PreviewSubtitle>
              AI가 예상 부케 이미지를 생성해드려요
            </PreviewSubtitle>
          </PreviewHeader>

          {previewImageUrl ? (
            <PreviewImageWrap>
              <PreviewImage src={previewImageUrl} alt="AI 예상 부케 이미지" />
              <RegenerateBtn
                onClick={handleGeneratePreview}
                disabled={previewLoading}
              >
                🔄 다시 생성
              </RegenerateBtn>
            </PreviewImageWrap>
          ) : (
            <PreviewPlaceholder>
              {previewLoading ? (
                <LoadingWrap>
                  <Spinner />
                  <LoadingText>AI가 부케를 그리고 있어요...</LoadingText>
                </LoadingWrap>
              ) : (
                <>
                  <PlaceholderEmoji>🎨</PlaceholderEmoji>
                  <PlaceholderText>
                    선택한 꽃과 포장지로 예상 부케를 미리 확인해보세요
                  </PlaceholderText>
                  {previewError && <ErrorText>{previewError}</ErrorText>}
                  <PreviewBtn onClick={handleGeneratePreview}>
                    미리보기 생성하기
                  </PreviewBtn>
                </>
              )}
            </PreviewPlaceholder>
          )}
        </PreviewSection>
      )}
      <PayButton onClick={handlePayment} disabled={submitting}>
        {submitting
          ? "처리 중..."
          : `${totalPrice.toLocaleString()}원 결제하기`}
      </PayButton>
    </Container>
  );
};

export default CartCheckoutPage;
