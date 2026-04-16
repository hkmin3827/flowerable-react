import { axiosInstance } from "@/shared/api/axios";
import type { RecommendResponse } from "./types";

export const sendAiRecommend = async (
  content: string,
): Promise<RecommendResponse> => {
  const { data } = await axiosInstance.post<RecommendResponse>(
    "/v1/ai/recommend",
    { content },
    { timeout: 40000 },
  );
  return data;
};
