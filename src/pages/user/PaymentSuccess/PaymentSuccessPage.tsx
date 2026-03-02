import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Container,
  Card,
  Spinner,
  SuccessIcon,
  Title,
  Desc,
  ProgressBar,
} from "./PaymentSuccessPage.styles";
import { paymentAPI } from "@/features/payment/api";

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  useEffect(() => {
    confirmPayment();
  }, []);

  const confirmPayment = async () => {
    const paymentKey = searchParams.get("paymentKey");
    const orderId = searchParams.get("orderId"); // Toss orderId = orderNumber
    const amount = Number(searchParams.get("amount"));
    const dbOrderId = searchParams.get("dbOrderId");

    if (!paymentKey || !orderId || !amount) {
      setStatus("error");
      return;
    }

    try {
      await paymentAPI.confirm({ paymentKey, orderId, amount });
    } catch (error: any) {
      console.warn("confirm 실패 → 서버 복구에 맡김", error);
    }
    setStatus("success");

    setTimeout(() => {
      navigate(`/orders/${dbOrderId}`, { replace: true });
    }, 1800);
  };

  if (status === "loading") {
    return (
      <Container>
        <Card>
          <Spinner />
          <Title>결제 승인 중...</Title>
          <Desc>잠시만 기다려주세요.</Desc>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <Card>
        <SuccessIcon>✅</SuccessIcon>
        <Title>결제 완료!</Title>
        <Desc>
          주문이 성공적으로 접수되었습니다.
          <br />
          잠시 후 주문 상세 페이지로 이동합니다.
        </Desc>
        <ProgressBar />
      </Card>
    </Container>
  );
};

export default PaymentSuccessPage;
