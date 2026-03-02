import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLogin } from "../hooks";
import { LoginRequest } from "../types";
import { Role } from "@/shared/types";
import GoogleIcon from "../../../images/logos/googlelogo.svg";
import KakaoLogin from "../../../images/logos/kakao_login_large_narrow.png";
import NaverLogin from "../../../images/logos/NAVER_login_Dark_EN_green_center_H56.png";
import {
  FormContainer,
  Title,
  InputGroup,
  Label,
  Input,
  PasswordWrapper,
  ShowPasswordButton,
  ErrorText,
  SubmitButton,
  LinkGroup,
  Link,
  Divider,
  SocialLoginSection,
  SocialButton,
} from "./components.styles";

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
