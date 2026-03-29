import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryClient } from "@/shared/client/queryClient";
import { axiosInstance } from "@/shared/api/axios";
import { useAuthStore } from "@/features/auth/store";

interface SSEState {
  instance: EventSource | null;
  connectedToken: string | null;
  connectedRole: string | null;
  reconnectTimer: ReturnType<typeof setTimeout> | null;
  reconnectAttempts: number;
}

const MAX_RECONNECT_ATTEMPTS = 5;
const BASE_RECONNECT_DELAY = 3000;

const sseState: SSEState = {
  instance: null,
  connectedToken: null,
  connectedRole: null,
  reconnectTimer: null,
  reconnectAttempts: 0,
};

const clearReconnectTimer = () => {
  if (sseState.reconnectTimer) {
    clearTimeout(sseState.reconnectTimer);
    sseState.reconnectTimer = null;
  }
};

const invalidateNotifications = () => {
  queryClient.invalidateQueries({ queryKey: ["notification", "unread-count"] });
  queryClient.invalidateQueries({ queryKey: ["notifications"] });
};

export const closeSSE = async () => {
  clearReconnectTimer();
  sseState.reconnectAttempts = 0;

  if (sseState.instance) {
    sseState.instance.close();
    sseState.instance = null;
  }
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
    console.error("[SSE] 서버 정리 실패", e);
  }
};

// 토큰 갱신 시 외부에서 호출
export const reconnectSSE = (newToken: string) => {
  const userRole = useAuthStore.getState().user?.role;
  if (!userRole) return;

  sseState.reconnectAttempts = 0;
  clearReconnectTimer();
  connectSSE(newToken, userRole, invalidateNotifications);
};

const connectSSE = (
  accessToken: string,
  userRole: string,
  onNotification: () => void,
) => {
  if (
    sseState.instance?.readyState === EventSource.OPEN &&
    sseState.connectedToken === accessToken &&
    sseState.connectedRole === userRole
  ) {
    return;
  }

  if (sseState.instance) {
    sseState.instance.close();
    sseState.instance = null;
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
    sseState.reconnectAttempts = 0;
    console.log(
      `%c[SSE] 연결 성공: ${userRole}`,
      "color: #2ecc71; font-weight: bold;",
    );
  };

  source.addEventListener("notification", onNotification);
  source.onmessage = onNotification;
  source.addEventListener("heartbeat", () => {});

  source.onerror = () => {
    if (sseState.instance !== source) return;

    source.close();
    sseState.instance = null;
    sseState.connectedToken = null;
    sseState.connectedRole = null;

    if (sseState.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.warn("[SSE] 최대 재연결 시도 초과.");
      return;
    }

    const delay =
      BASE_RECONNECT_DELAY * Math.pow(2, sseState.reconnectAttempts);
    sseState.reconnectAttempts += 1;
    console.warn(
      `[SSE] ${delay / 1000}초 후 재연결 (${sseState.reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`,
    );

    clearReconnectTimer();
    sseState.reconnectTimer = setTimeout(() => {
      const { accessToken: currentToken, isAuthenticated } =
        useAuthStore.getState();
      if (isAuthenticated && currentToken) {
        connectSSE(currentToken, userRole, onNotification);
      }
    }, delay);
  };
};

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    clearReconnectTimer();
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
  const queryClient = useQueryClient(); // hook 내부에선 그대로 사용 가능

  useEffect(() => {
    if (!_hasHydrated) return;

    if (!isAuthenticated || !accessToken || !userRole) {
      closeSSE();
      return;
    }

    connectSSE(accessToken, userRole, invalidateNotifications);

    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible") return;
      const isDisconnected =
        !sseState.instance ||
        sseState.instance.readyState === EventSource.CLOSED;

      if (isDisconnected) {
        console.log("[SSE] 탭 복귀 감지 - 재연결 시도");
        sseState.reconnectAttempts = 0;
        connectSSE(accessToken, userRole, invalidateNotifications);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
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
  });
};
