import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authApi } from "./api";
import { useAuthStore } from "./store";
import {
  LoginRequest,
  UserSignupRequest,
  ShopSignupRequest,
  OAuth2LoginRequest,
} from "./types";

// 로그인 mutation
export const useLogin = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (response) => {
      const {
        accessToken,
        refreshToken,
        role,
        accountId,
        name,
        profileImgUrl,
      } = response;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      setAuth({
        isAuthenticated: true,
        user: { id: accountId, name, role, profileImgUrl },
      });

      // Role에 따라 리다이렉트
      if (role === "SHOP") {
        navigate("/shop/dashboard");
      } else if (role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    },
  });
};

// 회원가입 mutation (User)
export const useSignupUser = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: UserSignupRequest) => authApi.signupUser(data),
    onSuccess: () => {
      navigate("/login");
    },
  });
};

// 회원가입 mutation (Shop)
export const useSignupShop = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: ShopSignupRequest) => authApi.signupShop(data),
    onSuccess: () => {
      navigate("/login");
    },
  });
};

// OAuth2 로그인 mutation
export const useOAuth2Login = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: OAuth2LoginRequest) => authApi.oauth2Login(data),
    onSuccess: (response) => {
      const { accessToken, refreshToken, role, accountId, name, email } =
        response;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      setAuth({
        isAuthenticated: true,
        user: { id: accountId, name, email, role },
      });

      navigate(role === "SHOP" ? "/shop/dashboard" : "/");
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
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      clearAuth();
      navigate("/login");
    },
  });
};

// 이메일 중복 체크 query
export const useCheckEmail = (email: string, enabled: boolean = false) => {
  return useQuery({
    queryKey: ["checkEmail", email],
    queryFn: () => authApi.checkEmail(email),
    enabled: enabled && !!email,
    staleTime: 0,
  });
};

// 회원 탈퇴 mutation
export const useWithdraw = () => {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: (password: string) => authApi.withdraw(password),
    onSuccess: () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      clearAuth();
      navigate("/");
    },
  });
};
