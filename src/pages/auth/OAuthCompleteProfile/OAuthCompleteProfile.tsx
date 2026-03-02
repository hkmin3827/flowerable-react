import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authApi } from "@/features/auth/api";
import { useAuthStore } from "@/features/auth/store";
import { extractErrorMessage } from "@/shared/utils/errorHandler";
import {
  Container,
  FormWrapper,
  Title,
  Subtitle,
  Form,
  FormGroup,
  Label,
  Input,
  ErrorText,
  HelperText,
  SubmitButton,
  Button,
} from "./OAuthCompleteProfile.styles";

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

    if (!formData.email) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다.";
    }

    if (!formData.telnum) {
      newErrors.telnum = "전화번호를 입력해주세요.";
    } else if (!/^[0-9]{10,11}$/.test(formData.telnum)) {
      newErrors.telnum = "10-11자리 숫자를 입력해주세요.";
    }

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
          shopStatus: null,
        },
      });

      navigate("/", { replace: true });
    } catch (error) {
      console.error("프로필 완성 실패:", error);
      alert(extractErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
