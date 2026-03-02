import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store";
import { authApi } from "@/features/auth/api";
import { useQueryClient } from "@tanstack/react-query";
import { cartApi } from "@/features/cart/api";
import {
  Container,
  ContentBox,
  Description,
  ErrorIconWrapper,
  Spinner,
  SpinnerWrapper,
  SubDescription,
  Title,
} from "./OAuthCallback.styles";
import { isAppAxiosError } from "@/shared/types/error";

const OAuthCallback = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { setAuth, clearAuth } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  const hasProcessedRef = useRef(false);

  useEffect(() => {
    if (hasProcessedRef.current) {
      console.log("⏭️ OAuth callback already processed, skipping");
      return;
    }
    hasProcessedRef.current = true;

    const handleOAuthCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const provider = params.get("provider");

        if (!code || !provider) {
          throw new Error("OAuth 인증 정보가 유효하지 않습니다.");
        }

        const response = await authApi.exchangeOAuthToken({
          code,
          provider,
        });

        if (!response) {
          throw new Error("서버 응답이 없습니다.");
        }

        if (!response.id || !response.provider) {
          console.error("❌ Invalid response structure:", response);
          throw new Error("서버 응답 형식이 올바르지 않습니다.");
        }

        if (response.accountStatus === "TEMP") {
          console.log("🔄 Redirecting to profile completion page");
          navigate("/oauth/complete", {
            replace: true,
            state: {
              accountId: response.id,
              provider: response.provider,
            },
          });
          return;
        }

        if (!response.accessToken || !response.refreshToken) {
          throw new Error("로그인 토큰을 받지 못했습니다.");
        }

        const authData = {
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
        };

        setAuth(authData);

        await queryClient.prefetchQuery({
          queryKey: ["cart", "count", authData.user.id],
          queryFn: cartApi.getCartCount,
        });
        navigate("/", { replace: true });
      } catch (err: unknown) {
        console.error("❌ OAuth 콜백 처리 실패:", err);
        if (isAppAxiosError(err)) {
          console.error("❌ Error details:", {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status,
          });
        }

        const errorMessage = isAppAxiosError(err)
          ? (err.response?.data?.message ??
            err.message ??
            "OAuth 로그인에 실패했습니다.")
          : err instanceof Error
            ? err.message
            : "OAuth 로그인에 실패했습니다.";

        setError(errorMessage);
        clearAuth();

        // 3초 후 로그인 페이지로 이동
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 3000);
      }
    };

    handleOAuthCallback();
  }, [navigate, setAuth, clearAuth]);

  if (error) {
    return (
      <Container>
        <ContentBox>
          <ErrorIconWrapper>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </ErrorIconWrapper>
          <Title>로그인 실패</Title>
          <Description>{error}</Description>
          <SubDescription>잠시 후 로그인 페이지로 이동합니다...</SubDescription>
        </ContentBox>
      </Container>
    );
  }

  return (
    <Container>
      <ContentBox>
        <SpinnerWrapper>
          <Spinner />
        </SpinnerWrapper>
        <Title>로그인 중...</Title>
        <Description>잠시만 기다려주세요.</Description>
      </ContentBox>
    </Container>
  );
};

export default OAuthCallback;
