import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/features/auth/api";
import {
  Container,
  Card,
  IconWrapper,
  Title,
  Description,
  Form,
  InputGroup,
  Label,
  Input,
  ErrorText,
  ErrorBanner,
  SubmitButton,
  BackButton,
  BackLink,
} from "./ForgotPasswordPage.styles";
import { isAppAxiosError } from "@/shared/types/error";

interface ForgotPasswordForm {
  email: string;
}

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>();

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await authApi.forgotPassword(data.email);
      setIsSubmitted(true);
    } catch (err: unknown) {
      const message = isAppAxiosError(err)
        ? (err.response?.data?.message ??
          "이메일 전송에 실패했습니다. 다시 시도해주세요.")
        : "이메일 전송에 실패했습니다. 다시 시도해주세요.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <Container>
        <Card>
          <IconWrapper>✉️</IconWrapper>
          <Title>이메일을 확인해주세요</Title>
          <Description>
            입력하신 이메일 주소로 비밀번호 재설정 링크를 보냈습니다.
            <br />
            링크는 <strong>10분</strong> 후 만료됩니다.
          </Description>
          <BackButton onClick={() => navigate("/login")}>
            로그인으로 돌아가기
          </BackButton>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <Card>
        <Title>비밀번호 찾기</Title>
        <Description>
          가입하신 이메일 주소를 입력하시면
          <br />
          비밀번호 재설정 링크를 보내드립니다.
        </Description>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <InputGroup>
            <Label>이메일</Label>
            <Input
              type="email"
              placeholder="example@email.com"
              {...register("email", {
                required: "이메일을 입력해주세요",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "올바른 이메일 형식이 아닙니다",
                },
              })}
            />
            {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
          </InputGroup>

          {errorMessage && <ErrorBanner>{errorMessage}</ErrorBanner>}

          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? "전송 중..." : "재설정 링크 보내기"}
          </SubmitButton>
        </Form>

        <BackLink onClick={() => navigate("/login")}>
          ← 로그인으로 돌아가기
        </BackLink>
      </Card>
    </Container>
  );
};
