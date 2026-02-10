import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { authApi } from "@/features/auth/api";
import { useAuthStore } from "@/features/auth/store";

export const OAuthCompleteProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const { accountId, provider } = location.state || {};

  const [formData, setFormData] = useState({
    email: "",
    telnum: "",
    name: "",
  });

  const [errors, setErrors] = useState<{
    email?: string;
    telnum?: string;
    name?: string;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    // 이메일 검증
    if (!formData.email) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다.";
    }

    // 전화번호 검증
    if (!formData.telnum) {
      newErrors.telnum = "전화번호를 입력해주세요.";
    } else if (!/^[0-9]{10,11}$/.test(formData.telnum)) {
      newErrors.telnum = "10-11자리 숫자를 입력해주세요.";
    }

    // 이름 검증
    if (!formData.name) {
      newErrors.name = "이름을 입력해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!accountId) {
      alert("계정 정보가 없습니다. 다시 로그인해주세요.");
      navigate("/login");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await authApi.completeOAuthSignup({
        accountId,
        email: formData.email,
        telnum: formData.telnum,
        name: formData.name,
      });

      // 로그인 처리
      setAuth({
        isAuthenticated: true,
        accountStatus: response.accountStatus,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        user: {
          id: response.id,
          role: response.role,
          name: response.name!,
          profileImgUrl:
            response.profileImgUrl ?? "/images/profileDefaultImg.jpg",
          provider: response.provider,
        },
      });

      navigate("/", { replace: true });
    } catch (error: any) {
      console.error("프로필 완성 실패:", error);
      alert(
        error.response?.data?.message ||
          "프로필 완성에 실패했습니다. 다시 시도해주세요.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // 입력 시 에러 메시지 제거
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  if (!accountId) {
    return (
      <Container>
        <FormWrapper>
          <Title>잘못된 접근입니다</Title>
          <p>다시 로그인해주세요.</p>
          <Button onClick={() => navigate("/login")}>로그인으로 이동</Button>
        </FormWrapper>
      </Container>
    );
  }

  return (
    <Container>
      <FormWrapper>
        <Title>추가 정보 입력</Title>
        <Subtitle>
          {provider} 계정으로 가입하셨습니다. 추가 정보를 입력해주세요.
        </Subtitle>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">이메일</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              $hasError={!!errors.email}
            />
            {errors.email && <ErrorText>{errors.email}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="name">이름</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="홍길동"
              $hasError={!!errors.name}
            />
            {errors.name && <ErrorText>{errors.name}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="telnum">전화번호</Label>
            <Input
              type="tel"
              id="telnum"
              name="telnum"
              value={formData.telnum}
              onChange={handleChange}
              placeholder="01012345678"
              $hasError={!!errors.telnum}
            />
            {errors.telnum && <ErrorText>{errors.telnum}</ErrorText>}
            <HelperText>숫자만 입력해주세요 (10-11자리)</HelperText>
          </FormGroup>

          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? "처리 중..." : "가입 완료"}
          </SubmitButton>
        </Form>
      </FormWrapper>
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9fafb;
  padding: 2rem 1rem;
`;

const FormWrapper = styled.div`
  background: white;
  border-radius: 0.5rem;
  padding: 2.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const Subtitle = styled.p`
  color: #6b7280;
  text-align: center;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
`;

const Input = styled.input<{ $hasError?: boolean }>`
  padding: 0.625rem 0.75rem;
  border: 1px solid ${(props) => (props.$hasError ? "#ef4444" : "#d1d5db")};
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${(props) => (props.$hasError ? "#ef4444" : "#3b82f6")};
    box-shadow: 0 0 0 3px
      ${(props) =>
        props.$hasError ? "rgba(239, 68, 68, 0.1)" : "rgba(59, 130, 246, 0.1)"};
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const ErrorText = styled.span`
  font-size: 0.75rem;
  color: #ef4444;
`;

const HelperText = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 0.5rem;

  &:hover:not(:disabled) {
    background-color: #2563eb;
  }

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 1rem;

  &:hover {
    background-color: #2563eb;
  }
`;
