import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";

const PaymentFailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const errorCode = searchParams.get("code");
  const errorMessage =
    searchParams.get("message") || "결제가 취소되었거나 실패하였습니다.";

  const getErrorGuide = (code: string | null) => {
    if (!code) return null;
    const guides: Record<string, string> = {
      PAY_PROCESS_CANCELED: "결제가 취소되었습니다.",
      PAY_PROCESS_ABORTED: "결제 진행 중 오류가 발생했습니다.",
      REJECT_CARD_COMPANY:
        "카드사에서 결제를 거절했습니다. 다른 카드를 이용해주세요.",
      INVALID_CARD_EXPIRATION: "카드 유효기간이 올바르지 않습니다.",
      INVALID_STOPPED_CARD: "사용 정지된 카드입니다.",
      EXCEED_MAX_DAILY_PAYMENT_COUNT: "일일 결제 한도를 초과했습니다.",
      NOT_ENOUGH_BALANCE: "카드 잔액이 부족합니다.",
    };
    return guides[code] ?? null;
  };

  const guide = getErrorGuide(errorCode);

  return (
    <Container>
      <Card>
        <Icon>😞</Icon>
        <Title>결제 실패</Title>
        <Desc>{guide || errorMessage}</Desc>
        {errorCode && <ErrorCode>오류 코드: {errorCode}</ErrorCode>}
        <ButtonGroup>
          <RetryButton onClick={() => navigate(-2)}>다시 시도</RetryButton>
          <HomeButton onClick={() => navigate("/")}>홈으로</HomeButton>
        </ButtonGroup>
      </Card>
    </Container>
  );
};

export default PaymentFailPage;

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
const Icon = styled.div`
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
  margin-bottom: 0.75rem;
`;
const ErrorCode = styled.div`
  font-size: 0.75rem;
  color: #9ca3af;
  background: #f3f4f6;
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  display: inline-block;
  margin-bottom: 2rem;
`;
const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
`;
const RetryButton = styled.button`
  padding: 0.75rem 1.5rem;
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
const HomeButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: white;
  color: #374151;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background: #f3f4f6;
  }
`;
