import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authApi } from "@/features/auth/api";
import { extractErrorMessage } from "@/shared/utils/errorHandler";
import {
  Container,
  Card,
  IconWrapper,
  Title,
  Description,
  Form,
  InputGroup,
  Label,
  PasswordWrapper,
  Input,
  ToggleButton,
  ErrorText,
  ErrorBanner,
  RetryLink,
  SubmitButton,
  ActionButton,
} from "./ResetPasswordPage.styles";
import { isAppAxiosError } from "@/shared/types/error";

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
    } catch (err: unknown) {
      const status = isAppAxiosError(err) ? err.response?.status : undefined;
      if (status === 401 || status === 403) {
        setErrorMessage(
          "링크가 만료되었거나 유효하지 않습니다. 비밀번호 찾기를 다시 시도해주세요.",
        );
      } else {
        alert(extractErrorMessage(err));
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
