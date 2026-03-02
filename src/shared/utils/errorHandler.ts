import { AxiosError } from "axios";

export const extractErrorMessage = (error: unknown): string => {
  if (!(error instanceof AxiosError)) return "알 수 없는 오류가 발생했습니다.";

  const status = error.response?.status;
  const data = error.response?.data as {
    message?: string;
    errors?: { message?: string }[];
  };

  if (data?.message) return data.message;

  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    return data.errors[0].message ?? "입력값을 확인해주세요.";
  }

  switch (status) {
    case 400:
      return "잘못된 요청입니다.";

    case 401:
      return "인증이 필요합니다. 다시 로그인해주세요.";

    case 403:
      return "접근 권한이 없습니다.";

    case 404:
      return "요청한 리소스를 찾을 수 없습니다.";

    case 409:
      return "이미 존재하는 데이터입니다.";

    case 422:
      return "입력값 형식이 올바르지 않습니다.";

    case 500:
      return "서버 내부 오류가 발생했습니다.";

    case 502:
    case 503:
      return "서버가 일시적으로 응답하지 않습니다.";

    default:
      return "요청 처리 중 오류가 발생했습니다.";
  }
};
