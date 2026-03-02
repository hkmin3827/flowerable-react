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

  _hasHydrated: boolean;
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

  updateUser: (user: Partial<UserInfo>) => void;

  clearAuth: () => void;

  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      accountStatus: null,
      accessToken: null,
      refreshToken: null,
      user: null,
      _hasHydrated: false,

      setAuth: (data) =>
        set({
          isAuthenticated: data.isAuthenticated,
          accountStatus: data.accountStatus,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          user: data.user,
        }),
      updateUser: (user: Partial<UserInfo>) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...user } : null,
        })),
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
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        accountStatus: state.accountStatus,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    },
  ),
);
