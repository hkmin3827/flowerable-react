import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserInfo } from "./types";
import { AccountStatus } from "@/shared/types";

interface AuthState {
  isAuthenticated: boolean;
  accountStatus: AccountStatus | null;

  accessToken: string | null;
  refreshToken: string | null;

  user: UserInfo | null;
  setAuth: (data: {
    isAuthenticated: boolean;
    accountStatus: AuthState["accountStatus"];
    accessToken: string | null;
    refreshToken: string | null;
    user: UserInfo | null;
  }) => void;

  updateTokens: (data: {
    accessToken: string;
    refreshToken: string;
    accountStatus: AuthState["accountStatus"];
  }) => void;

  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      accountStatus: null,
      accessToken: null,
      refreshToken: null,
      user: null,

      setAuth: (data) =>
        set({
          isAuthenticated: data.isAuthenticated,
          accountStatus: data.accountStatus,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          user: data.user,
        }),
      updateTokens: ({ accessToken, refreshToken, accountStatus }) =>
        set((state) => ({
          ...state,
          accessToken,
          refreshToken,
          accountStatus,
        })),
      clearAuth: () =>
        set({
          isAuthenticated: false,
          accountStatus: null,
          accessToken: null,
          refreshToken: null,
          user: null,
        }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        // 보안상 user는 제외하고 싶으면 여기서 조절 가능
        isAuthenticated: state.isAuthenticated,
        accountStatus: state.accountStatus,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    },
  ),
);
