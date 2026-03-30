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

      PAYMENT_ALREADY_DONE: "이미 결제가 완료된 주문입니다.",
      PAYMENT_AMOUNT_BAD_REQUEST:
        "주문 금액과 결제 금액이 일치하지 않습니다. 다시 시도해주세요.",
      PAYMENT_CONCURRENT_REQUEST:
        "결제 요청이 처리 중입니다. 잠시 후 다시 시도해주세요.",
      PAYMENT_TOSS_TIMEOUT:
        "결제 서버 응답이 지연되고 있습니다. 잠시 후 주문 내역을 확인하거나 고객센터에 문의해주세요.",
      PAYMENT_SAVE_FAILED:
        "결제는 완료됐으나 서버 오류로 주문이 실패했습니다. 잠시 후 주문 내역을 확인하거나 환불 여부를 확인해주세요. 지속적인 문제가 있을 시 고객센터로 연락해주세요.",
      PAYMENT_CANCEL_FAILED:
        "결제 취소 처리에 실패했습니다. 고객센터에 문의해주세요.",
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
