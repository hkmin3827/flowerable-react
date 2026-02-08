import { useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { useLogin } from "./hooks";
import { LoginRequest } from "./types";
import { Role } from "@/shared/types";
import GoogleIcon from "../../icons/googlelogo.svg";
import KakaoLogin from "../../icons/kakao_login_large_narrow.png";
import NaverLogin from "../../icons/NAVER_login_Dark_EN_green_center_H56.png";

interface LoginFormProps {
  role: Role;
}

export const LoginForm = ({ role }: LoginFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();
  const { mutate: login, isPending } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

  const onSubmit = (data: LoginRequest) => {
    login({
      ...data,
      role,
    });
  };
  const handleGoogleLogin = () => {
    window.location.href = `${VITE_BASE_URL}/oauth2/authorization/google`;
  };

  const handleKakaoLogin = () => {
    window.location.href = `${VITE_BASE_URL}/oauth2/authorization/kakao`;
  };

  const handleNaverLogin = () => {
    window.location.href = `${VITE_BASE_URL}/oauth2/authorization/naver`;
  };

  return (
    <FormContainer onSubmit={handleSubmit(onSubmit)}>
      <Title>로그인</Title>
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
      <InputGroup>
        <Label>비밀번호</Label>
        <PasswordWrapper>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="비밀번호"
            {...register("password", {
              required: "비밀번호를 입력해주세요",
              minLength: {
                value: 8,
                message: "비밀번호는 최소 8자 이상이어야 합니다",
              },
            })}
          />
          <ShowPasswordButton
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "숨기기" : "보기"}
          </ShowPasswordButton>
        </PasswordWrapper>
        {errors.password && <ErrorText>{errors.password.message}</ErrorText>}
      </InputGroup>
      <SubmitButton type="submit" disabled={isPending}>
        {isPending ? "로그인 중..." : "로그인"}
      </SubmitButton>
      <LinkGroup>
        <Link href="/signup">회원가입</Link>
        <Divider>|</Divider>
        <Link href="/find-password">비밀번호 찾기</Link>
      </LinkGroup>
      {role == "ROLE_USER" && (
        <SocialLoginSection>
          <Divider>또는</Divider>
          <SocialButton
            type="button"
            provider="kakao"
            onClick={handleKakaoLogin}
          >
            <img id="kakao" src={KakaoLogin} alt="Kakao login" />
          </SocialButton>
          <SocialButton
            type="button"
            provider="naver"
            onClick={handleNaverLogin}
          >
            <img id="naver" src={NaverLogin} alt="Naver login" />
          </SocialButton>
          <SocialButton
            type="button"
            provider="google"
            onClick={handleGoogleLogin}
          >
            <img id="google-icon" src={GoogleIcon} alt="Google logo" />
            Sign in with Google
          </SocialButton>
        </SocialLoginSection>
      )}
    </FormContainer>
  );
};

// Styled Components
const FormContainer = styled.form`
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #374151;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const PasswordWrapper = styled.div`
  position: relative;
`;

const ShowPasswordButton = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  font-size: 0.875rem;
  cursor: pointer;

  &:hover {
    color: #374151;
  }
`;

const ErrorText = styled.p`
  font-size: 0.875rem;
  color: #ef4444;
  margin-top: 0.25rem;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
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

const LinkGroup = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
  font-size: 0.875rem;
`;

const Link = styled.a`
  color: #6b7280;
  text-decoration: none;

  &:hover {
    color: #374151;
  }
`;

const Divider = styled.span`
  margin: 0 0.5rem;
  color: #d1d5db;
`;

const SocialLoginSection = styled.div`
  margin-top: 2rem;
`;

const SocialButton = styled.button<{ provider: "kakao" | "naver" | "google" }>`
  width: 100%;
  padding: 0.75rem;
  margin-top: 0.75rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;

  ${({ provider }) => {
    const colors = {
      kakao: { bg: "#FEE500", color: "#000000" },
      naver: { bg: "#03C75A", color: "#FFFFFF" },
      google: { bg: "#FFFFFF", color: "#000000" },
    };
    return `
      background-color: ${colors[provider].bg};
      color: ${colors[provider].color};
      ${provider === "google" ? "border: 1px solid #d1d5db;" : ""}
    `;
  }}

  &:hover {
    opacity: 0.9;
  }
`;
