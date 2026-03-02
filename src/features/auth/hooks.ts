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
import { extractErrorMessage } from "@/shared/utils/errorHandler";
import { AxiosError } from "axios";

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
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          alert("이메일 또는 비밀번호가 일치하지 않습니다.");
          return;
        }
      }
      alert(extractErrorMessage(error));
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
    onError: (error) => {
      alert(extractErrorMessage(error));
    },
  });
};

export const useSignupShop = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: ShopSignupRequest) => authApi.signupShop(data),
    onSuccess: () => {
      alert("회원가입이 완료되었습니다.");
      navigate("/login");
    },
    onError: (error) => {
      alert(extractErrorMessage(error));
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: async () => {
      await closeSSE();

      clearAuth();
      navigate("/login");
    },
    onError: (error) => {
      alert(extractErrorMessage(error));
    },
  });
};

export const useWithdraw = () => {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: (data: WithdrawReq) => authApi.withdraw(data),
    onSuccess: async () => {
      await closeSSE();

      clearAuth();
      alert("회원탈퇴가 완료되었습니다.");
      navigate("/");
    },
    onError: (error) => {
      alert(extractErrorMessage(error));
    },
  });
};
