import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/shared/api/axios";
import { useAuthStore } from "@/features/auth/store";

// ── SSE 싱글톤 ──────────────────────────────────────────────
let sseInstance: EventSource | null = null;

/** 로그아웃/탈퇴 시 외부에서 직접 호출할 수 있는 SSE 종료 함수 */
export const closeSSE = () => {
  if (sseInstance) {
    sseInstance.close();
    sseInstance = null;
  }
};

// ── 알림 SSE 연결 hook ───────────────────────────────────────
/**
 * 로그인 상태일 때 SSE를 구독하고,
 * 알림 이벤트가 오면 unread-count 캐시를 자동으로 갱신한다.
 * 로그아웃/토큰 소멸 시 자동으로 연결을 끊는다.
 */
export const useNotificationSSE = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const accessToken = useAuthStore((s) => s.accessToken);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      closeSSE();
      return;
    }

    // 이미 연결 중이면 재연결 방지
    if (sseInstance) return;

    const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";
    const url = `${baseURL}/notifications/subscribe?token=${encodeURIComponent(accessToken)}`;

    sseInstance = new EventSource(url);

    // 서버가 event 이름 없이 data만 보낼 때 (기본 message 이벤트)
    sseInstance.onmessage = () => {
      queryClient.invalidateQueries({
        queryKey: ["notification", "unread-count"],
      });
    };

    // 서버가 event: notification 형태로 보낼 때
    sseInstance.addEventListener("notification", () => {
      queryClient.invalidateQueries({
        queryKey: ["notification", "unread-count"],
      });
    });

    sseInstance.onerror = (e) => {
      console.error("SSE 연결 오류:", e);
      closeSSE();
    };

    return () => {
      closeSSE();
    };
  }, [isAuthenticated, accessToken, queryClient]);
};

// ── 미읽은 알림 카운트 polling (SSE 보조 fallback) ───────────
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
    refetchInterval: 30000, // SSE가 있으므로 30초 fallback polling으로 완화
  });
};
