import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { authApi } from "@/features/auth/api";

interface ResetPasswordForm {
  newPassword: string;
  confirmPassword: string;
}

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordForm>();

  const newPassword = watch("newPassword");

  if (!token) {
    return (
      <Container>
        <Card>
          <IconWrapper>⚠️</IconWrapper>
          <Title>유효하지 않은 링크</Title>
          <Description>
            비밀번호 재설정 링크가 올바르지 않습니다.
            <br />
            이메일의 링크를 다시 확인하거나 재설정을 새로 요청해주세요.
          </Description>
          <ActionButton onClick={() => navigate("/find-password")}>
            비밀번호 찾기로 이동
          </ActionButton>
        </Card>
      </Container>
    );
  }

  const onSubmit = async (data: ResetPasswordForm) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await authApi.resetPassword(token, data.newPassword);
      navigate("/login", {
        state: {
          message:
            "비밀번호가 성공적으로 변경되었습니다. 새 비밀번호로 로그인해주세요.",
        },
      });
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        setErrorMessage(
          "링크가 만료되었거나 유효하지 않습니다. 비밀번호 찾기를 다시 시도해주세요.",
        );
      } else {
        setErrorMessage(
          err?.response?.data?.message ??
            "비밀번호 변경에 실패했습니다. 다시 시도해주세요.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Card>
        <Title>새 비밀번호 설정</Title>
        <Description>새로 사용할 비밀번호를 입력해주세요.</Description>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <InputGroup>
            <Label>새 비밀번호</Label>
            <PasswordWrapper>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="8자 이상 입력"
                {...register("newPassword", {
                  required: "새 비밀번호를 입력해주세요",
                  minLength: {
                    value: 8,
                    message: "비밀번호는 최소 8자 이상이어야 합니다",
                  },
                })}
              />
              <ToggleButton
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "숨기기" : "보기"}
              </ToggleButton>
            </PasswordWrapper>
            {errors.newPassword && (
              <ErrorText>{errors.newPassword.message}</ErrorText>
            )}
          </InputGroup>

          <InputGroup>
            <Label>비밀번호 확인</Label>
            <PasswordWrapper>
              <Input
                type={showConfirm ? "text" : "password"}
                placeholder="비밀번호 재입력"
                {...register("confirmPassword", {
                  required: "비밀번호 확인을 입력해주세요",
                  validate: (value) =>
                    value === newPassword || "비밀번호가 일치하지 않습니다",
                })}
              />
              <ToggleButton
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? "숨기기" : "보기"}
              </ToggleButton>
            </PasswordWrapper>
            {errors.confirmPassword && (
              <ErrorText>{errors.confirmPassword.message}</ErrorText>
            )}
          </InputGroup>

          {errorMessage && (
            <ErrorBanner>
              {errorMessage}
              {errorMessage.includes("만료") && (
                <RetryLink onClick={() => navigate("/find-password")}>
                  재설정 링크 다시 요청하기 →
                </RetryLink>
              )}
            </ErrorBanner>
          )}

          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? "변경 중..." : "비밀번호 변경"}
          </SubmitButton>
        </Form>
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

const PasswordWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.7rem 4rem 0.7rem 0.9rem;
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

const ToggleButton = styled.button`
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  color: #6b7280;
  font-size: 0.8rem;
  cursor: pointer;
  padding: 0;

  &:hover {
    color: #3b82f6;
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

const RetryLink = styled.button`
  background: none;
  border: none;
  color: #b91c1c;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  display: block;
  margin-top: 0.4rem;
  padding: 0;
  text-decoration: underline;
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

const ActionButton = styled.button`
  width: 100%;
  padding: 0.8rem;
  background-color: #3b82f6;
  color: white;
  font-size: 0.95rem;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;

  &:hover {
    background-color: #2563eb;
  }
`;
