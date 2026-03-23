import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/shared/api/axios";
import { useAuthStore } from "@/features/auth/store";

interface SSEState {
  instance: EventSource | null;
  connectedToken: string | null;
  connectedRole: string | null;
}

const sseState: SSEState = {
  instance: null,
  connectedToken: null,
  connectedRole: null,
};

export const closeSSE = async () => {
  if (!sseState.instance) return;

  sseState.instance.close();
  sseState.instance = null;
  sseState.connectedToken = null;
  sseState.connectedRole = null;

  const { accessToken, _hasHydrated } = useAuthStore.getState();

  if (!_hasHydrated || !accessToken) {
    console.log(
      "[SSE] 토큰이 없거나 초기화 전이라 서버 정리 요청을 생략합니다.",
    );
    return;
  }

  try {
    await axiosInstance.post("/notifications/disconnect");
    console.log("[SSE] 서버 커넥션 정리 완료");
  } catch (e) {
    console.error("[SSE] 서버 정리 실패 (이미 세션이 만료되었을 수 있음)", e);
  }
};

const connectSSE = (
  accessToken: string,
  userRole: string,
  onNotification: () => void,
) => {
  if (
    sseState.instance &&
    sseState.connectedToken === accessToken &&
    sseState.connectedRole === userRole
  ) {
    return;
  }

  if (sseState.instance) {
    sseState.instance.close();
  }

  const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";
  const subscribeEndpoint =
    userRole === "ROLE_SHOP"
      ? "/notifications/subscribe/shop"
      : "/notifications/subscribe/user";

  const url = `${baseURL}${subscribeEndpoint}?token=${encodeURIComponent(accessToken)}`;

  const source = new EventSource(url);
  sseState.instance = source;
  sseState.connectedToken = accessToken;
  sseState.connectedRole = userRole;

  source.onopen = () => {
    console.log(
      `%c[SSE] 연결 성공: ${userRole}`,
      "color: #2ecc71; font-weight: bold;",
    );
  };

  source.addEventListener("notification", onNotification);
  source.onmessage = onNotification;
  source.addEventListener("heartbeat", () => {
    // console.debug("[SSE] heartbeat received");
  });

  source.onerror = (e) => {
    console.error("SSE 연결 오류:", e);
    if (sseState.instance === source) {
      sseState.instance = null;
      sseState.connectedToken = null;
      sseState.connectedRole = null;
    }
  };
};

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    sseState.instance?.close();
  });
}

export const useNotificationSSE = () => {
  const { isAuthenticated, accessToken, userRole, _hasHydrated } = useAuthStore(
    (s) => ({
      isAuthenticated: s.isAuthenticated,
      accessToken: s.accessToken,
      userRole: s.user?.role,
      _hasHydrated: s._hasHydrated,
    }),
  );
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!isAuthenticated || !accessToken || !userRole) {
      if (sseState.instance) {
        closeSSE();
      }
      return;
    }
    const handleNotification = () => {
      queryClient.invalidateQueries({
        queryKey: ["notification", "unread-count"],
      });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    };

    connectSSE(accessToken, userRole, handleNotification);

    return () => {};
  }, [_hasHydrated, isAuthenticated, accessToken, userRole, queryClient]);
};

export const useUnreadNotificationCount = (enabled: boolean) => {
  return useQuery({
    queryKey: ["notification", "unread-count"],
    queryFn: async () => {
      const res = await axiosInstance.get<number>(
        "/notifications/unread-count",
      );
      return res.data;
    },
    enabled,
    refetchInterval: 10000,
  });
};
