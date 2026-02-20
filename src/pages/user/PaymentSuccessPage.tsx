import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { paymentAPI } from "@/features/payment/api";

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    confirmPayment();
  }, []);

  const confirmPayment = async () => {
    const paymentKey = searchParams.get("paymentKey");
    const orderId = searchParams.get("orderId"); // Toss orderId = orderNumber
    const amount = Number(searchParams.get("amount"));
    const dbOrderId = searchParams.get("dbOrderId");

    if (!paymentKey || !orderId || !amount) {
      setErrorMsg("결제 정보가 올바르지 않습니다.");
      setStatus("error");
      return;
    }

    try {
      await paymentAPI.confirm({ paymentKey, orderId, amount });
    } catch (error: any) {
      console.warn("confirm 실패 → 서버 복구에 맡김", error);
      setErrorMsg(
        error.response?.data?.message || "결제 승인 중 오류가 발생했습니다.",
      );
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

const spin = keyframes`from { transform: rotate(0deg); } to { transform: rotate(360deg); }`;
const fillBar = keyframes`from { width: 0%; } to { width: 100%; }`;

const Container = styled.div`
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;
const Card = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  padding: 3rem 2rem;
  text-align: center;
  max-width: 420px;
  width: 100%;
`;
const Spinner = styled.div`
  width: 3rem;
  height: 3rem;
  border: 4px solid #fce7f3;
  border-top-color: #ec4899;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
  margin: 0 auto 1.5rem;
`;
const SuccessIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;
const ErrorIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;
const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.75rem;
`;
const Desc = styled.p`
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 2rem;
`;
const ProgressBar = styled.div`
  height: 4px;
  background: #fce7f3;
  border-radius: 9999px;
  overflow: hidden;
  &::after {
    content: "";
    display: block;
    height: 100%;
    background: linear-gradient(90deg, #ec4899, #db2777);
    animation: ${fillBar} 1.8s linear forwards;
  }
`;
const HomeButton = styled.button`
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, #ec4899, #db2777);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;
