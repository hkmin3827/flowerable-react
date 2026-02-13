import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authApi } from "./api";
import { useAuthStore } from "./store";
import { LoginRequest, UserSignupRequest, ShopSignupRequest } from "./types";
import { useQueryClient } from "@tanstack/react-query";

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
