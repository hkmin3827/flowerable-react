import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Container,
  Card,
  Icon,
  Title,
  Desc,
  ErrorCode,
  ButtonGroup,
  RetryButton,
  HomeButton,
} from "./PaymentFailPage.styles";

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
