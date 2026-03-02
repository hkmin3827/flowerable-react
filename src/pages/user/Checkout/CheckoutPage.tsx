import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { axiosInstance } from "@/shared/api/axios";
import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import type { FlowerSelection } from "../Order/OrderPage";
import { PAYMENT_METHODS, type PaymentMethod } from "@/features/payment/types";
import { extractErrorMessage } from "@/shared/utils/errorHandler";
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
  WrappingOption,
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
  PayButton,
} from "./CheckoutPage.styles";

const TOSS_CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY;

interface WrappingOptionRes {
  shopId: number;
  colorNames: string[];
  price: number;
}

interface LocationState {
  flowers: FlowerSelection[];
  shopName: string;
}

const CheckoutPage = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const [wrappingOptions, setWrappingOptions] =
    useState<WrappingOptionRes | null>(null);
  const [selectedWrapping, setSelectedWrapping] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("CARD");
  const [submitting, setSubmitting] = useState(false);

  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const generatingRef = useRef(false);
  const flowers: FlowerSelection[] = state?.flowers || [];
  const shopName: string = state?.shopName || "샵";

  useEffect(() => {
    if (!flowers.length) {
      navigate(-1);
      return;
    }
    fetchWrappingOptions();
  }, [shopId]);

  useEffect(() => {
    setPreviewImageUrl(null);
    setPreviewError(null);
  }, [selectedWrapping]);

  const fetchWrappingOptions = async () => {
    try {
      const res = await axiosInstance.get(
        `/orders/users/${shopId}/wrapping-options`,
      );
      setWrappingOptions(res.data);
    } catch {
      // 포장 옵션 없음 - 정상
    }
  };

  const flowerTotal = flowers.reduce(
    (sum, f) => sum + f.basePrice * f.quantity,
    0,
  );
  const wrappingPrice =
    selectedWrapping && wrappingOptions ? wrappingOptions.price : 0;
  const totalPrice = flowerTotal + wrappingPrice;

  const handleGeneratePreview = async () => {
    console.log("🔥 preview click");
    if (generatingRef.current) return;
    generatingRef.current = true;

    setPreviewLoading(true);
    setPreviewError(null);
    setPreviewImageUrl(null);

    try {
      const res = await axiosInstance.post(
        `/orders/users/${shopId}/bouquet-preview`,
        {
          orderItems: flowers.map((f) => ({
            flowerName: f.flowerName,
            flowerColor: f.color,
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

  const handlePayment = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const orderRes = await axiosInstance.post(`/orders/users/${shopId}`, {
        orderItems: flowers.map((f) => ({
          shopFlowerId: f.shopFlowerId,
          quantity: f.quantity,
          flowerColor: f.color,
        })),
        wrappingColorName: selectedWrapping ?? null,
        wrappingExtraPrice: selectedWrapping
          ? (wrappingOptions?.price ?? 0)
          : 0,
        message: message.trim() || null,
      });

      const {
        orderId: dbOrderId,
        orderNumber,
        totalPrice: confirmTotal,
      } = orderRes.data;

      const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY);
      const payment = tossPayments.payment({ customerKey: ANONYMOUS });
      const commonOptions = {
        amount: { currency: "KRW" as const, value: confirmTotal },
        orderId: orderNumber,
        orderName: `${shopName} 꽃 주문`,
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
        alert(extractErrorMessage(error));
      }
      setSubmitting(false);
    }
  };

  return (
    <Container>
      <Header>
        <BackBtn onClick={() => navigate(-1)}>← 이전</BackBtn>
        <PageTitle>주문하기</PageTitle>
      </Header>

      <Card>
        <CardTitle>🌸 주문 상품</CardTitle>
        {flowers.map((f, i) => (
          <ItemRow key={i}>
            <ItemName>
              {f.flowerName} ({f.color})
            </ItemName>
            <ItemRight>
              <ItemQty>x{f.quantity}</ItemQty>
              <ItemPrice>
                {(f.basePrice * f.quantity).toLocaleString()}원
              </ItemPrice>
            </ItemRight>
          </ItemRow>
        ))}
      </Card>

      {wrappingOptions && wrappingOptions.colorNames.length > 0 && (
        <Card>
          <CardTitle>🎀 포장지 선택</CardTitle>
          <WrappingGrid>
            {wrappingOptions.colorNames.map((color) => (
              <WrappingOption
                key={color}
                $selected={selectedWrapping === color}
                onClick={() => setSelectedWrapping(color)}
              >
                <WrappingLabel>{color}</WrappingLabel>
                <WrappingPrice>
                  +{wrappingOptions.price.toLocaleString()}원
                </WrappingPrice>
              </WrappingOption>
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

export default CheckoutPage;
