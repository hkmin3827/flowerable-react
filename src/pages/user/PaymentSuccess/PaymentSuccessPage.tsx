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
import axios from "axios";

const BACKEND_ERROR_GUIDES: Record<string, string> = {
  PAYMENT_ALREADY_DONE: "이미 결제가 완료된 주문입니다.",
  PAYMENT_AMOUNT_BAD_REQUEST:
    "주문 금액과 결제 금액이 일치하지 않습니다. 다시 시도해주세요.",
  PAYMENT_CONCURRENT_REQUEST:
    "결제 요청이 처리 중입니다. 잠시 후 다시 시도해주세요.",
  PAYMENT_TOSS_TIMEOUT:
    "결제 서버 응답이 지연되고 있습니다. 잠시 후 주문 내역을 확인하거나 고객센터에 문의해주세요.",
  PAYMENT_SAVE_FAILED:
    "결제는 완료됐으나 서버 오류로 주문이 실패했습니다. 잠시 후 주문 내역을 확인하거나 환불 여부를 확인해주세요. 지속적인 문제가 있을 시 고객센터로 연락해주세요.",
};

const FALLBACK_MESSAGE =
  "알 수 없는 오류: 결제에 실패하였습니다. 잠시 후 다시 시도해주세요.";

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
      alert(FALLBACK_MESSAGE);
      setStatus("error");
      return;
    }

    try {
      const res = await paymentAPI.confirm({ paymentKey, orderId, amount });
      setStatus("success");
      setTimeout(() => {
        navigate(`/orders/${res.data.orderId}`, { replace: true });
      }, 1800);
    } catch (error: unknown) {
      handleConfirmError(error, dbOrderId);
    }
  };

  const handleConfirmError = (error: unknown, dbOrderId: string | null) => {
    if (axios.isAxiosError(error) && !error.response) {
      alert(
        "결제 서버 응답이 지연되고 있습니다. 잠시 후 주문 내역을 확인하거나 고객센터에 문의해주세요.",
      );
      setStatus("error");
      return;
    }

    if (axios.isAxiosError(error) && error.response) {
      const code: string | undefined = error.response.data?.code;
      const serverMessage: string | undefined = error.response.data?.message;

      if (code === "PAYMENT_ALREADY_DONE") {
        setStatus("success");
        setTimeout(() => {
          navigate(`/orders/${dbOrderId}`, { replace: true });
        }, 1800);
        return;
      }

      const alertMessage =
        (code && BACKEND_ERROR_GUIDES[code]) ??
        serverMessage ??
        FALLBACK_MESSAGE;

      alert(alertMessage);
      setStatus("error");
      return;
    }
    alert(FALLBACK_MESSAGE);
    setStatus("error");
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

  if (status === "error") {
    return (
      <Container>
        <Card>
          <Title>결제 실패</Title>
          <Desc>결제 처리 중 문제가 발생했습니다.</Desc>
          <button onClick={() => navigate(-1)}>다시 시도</button>
          <button onClick={() => navigate("/")}>홈으로</button>
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
