import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store";
import { authApi } from "@/features/auth/api";

const OAuthCallback = () => {
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
        // URL에서 인증 코드 추출
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

        // 응답 검증
        if (!response) {
          throw new Error("서버 응답이 없습니다.");
        }

        if (!response.id || !response.provider) {
          console.error("❌ Invalid response structure:", response);
          throw new Error("서버 응답 형식이 올바르지 않습니다.");
        }

        // TEMP 계정 → 추가 정보 입력 페이지
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

        // accessToken 검증
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
          },
        };

        setAuth(authData);

        navigate("/", { replace: true });
      } catch (err: any) {
        console.error("❌ OAuth 콜백 처리 실패:", err);
        console.error("❌ Error details:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });

        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "OAuth 로그인에 실패했습니다.";

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
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-red-500">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">로그인 실패</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <p className="mt-4 text-sm text-gray-500">
            잠시 후 로그인 페이지로 이동합니다...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">로그인 중...</h2>
        <p className="mt-2 text-gray-600">잠시만 기다려주세요.</p>
      </div>
    </div>
  );
};

export default OAuthCallback;
