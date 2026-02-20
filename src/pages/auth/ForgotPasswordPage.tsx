import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { authApi } from "@/features/auth/api";

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
    } catch (err: any) {
      const message =
        err?.response?.data?.message ??
        "이메일 전송에 실패했습니다. 다시 시도해주세요.";
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

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
  padding: 1rem;
`;

const Card = styled.div`
  width: 100%;
  max-width: 440px;
  background: white;
  border-radius: 1rem;
  padding: 2.5rem 2rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  text-align: center;
`;

const IconWrapper = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.75rem;
`;

const Description = styled.p`
  font-size: 0.9rem;
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  text-align: left;
`;

const InputGroup = styled.div`
  margin-bottom: 1.25rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.4rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.7rem 0.9rem;
  border: 1.5px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s;

  &:focus {
    border-color: #3b82f6;
  }
`;

const ErrorText = styled.p`
  font-size: 0.8rem;
  color: #ef4444;
  margin-top: 0.3rem;
`;

const ErrorBanner = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.8rem;
  background-color: #3b82f6;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: #2563eb;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const BackButton = styled.button`
  width: 100%;
  padding: 0.8rem;
  background-color: #f3f4f6;
  color: #374151;
  font-size: 0.95rem;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e5e7eb;
  }
`;

const BackLink = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  font-size: 0.875rem;
  cursor: pointer;
  margin-top: 1.5rem;
  display: block;
  margin-left: auto;
  margin-right: auto;

  &:hover {
    color: #3b82f6;
    text-decoration: underline;
  }
`;
