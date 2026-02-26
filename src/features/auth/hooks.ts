import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authApi } from "./api";
import { useAuthStore } from "./store";
import {
  LoginRequest,
  UserSignupRequest,
  ShopSignupRequest,
  WithdrawReq,
} from "./types";
import { useQueryClient } from "@tanstack/react-query";
import { closeSSE } from "@/features/notification/hooks";

export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (res) => {
      const {
        accessToken,
        refreshToken,
        role,
        id,
        name,
        profileImgUrl,
        accountStatus,
        provider,
        shopStatus,
      } = res;

      if (accountStatus !== "ACTIVE") {
        return;
      }

      if (!accessToken || !refreshToken || !name) {
        throw new Error("Invalid active account response");
      }

      setAuth({
        isAuthenticated: true,
        accountStatus,
        accessToken,
        refreshToken,
        user: {
          id,
          name,
          role,
          profileImgUrl: profileImgUrl ?? "../../images/profileDefaultImg.jpg",
          provider,
          shopStatus,
        },
      });
      queryClient.invalidateQueries({ queryKey: ["cart", "count"] });
      if (role === "ROLE_SHOP" && shopStatus != "PENDING") {
        navigate("/shop/dashboard");
      } else if (role === "ROLE_SHOP" && shopStatus == "PENDING") {
        navigate("/shop/pending-home");
      } else if (role === "ROLE_ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    },
    onError: (error: any) => {
      const status = error?.response?.status;
      const data = error?.response?.data;

      if (data?.message) {
        alert(data.message);
        return;
      }

      if (data?.code) {
        alert(data.code);
        return;
      }

      if (status === 401) {
        alert("이메일 또는 비밀번호가 올바르지 않습니다.");
        return;
      }

      if (status >= 500) {
        alert("서버 오류가 발생했습니다.");
        return;
      }

      alert("로그인 중 오류가 발생했습니다.");
    },
  });
};

export const useSignupUser = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: UserSignupRequest) => authApi.signupUser(data),
    onSuccess: () => {
      alert("회원가입이 완료되었습니다.");
      navigate("/login");
    },
    onError: (error: any) => {
      const serverData = error.response?.data;

      if (serverData?.message) {
        alert(serverData.message);
        return;
      }

      if (Array.isArray(serverData?.errors) && serverData.errors.length > 0) {
        alert(serverData.errors[0].message);
        return;
      }

      alert("회원가입 중 서버 오류가 발생했습니다.");
    },
  });
};

// 회원가입 mutation (Shop)
export const useSignupShop = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: ShopSignupRequest) => authApi.signupShop(data),
    onSuccess: () => {
      alert("회원가입이 완료되었습니다.");
      navigate("/login");
    },
    onError: (error: any) => {
      const serverData = error.response?.data;

      if (serverData?.message) {
        alert(serverData.message);
        return;
      }

      if (Array.isArray(serverData?.errors) && serverData.errors.length > 0) {
        alert(serverData.errors[0].message);
        return;
      }

      alert("회원가입 중 서버 오류가 발생했습니다.");
    },
  });
};

// 로그아웃 mutation
export const useLogout = () => {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      closeSSE();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      clearAuth();
      navigate("/login");
    },
  });
};

// 회원 탈퇴 mutation
export const useWithdraw = () => {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: (data: WithdrawReq) => authApi.withdraw(data),
    onSuccess: () => {
      closeSSE();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      clearAuth();
      alert("회원탈퇴가 완료되었습니다.");
      navigate("/");
    },
  });
};
