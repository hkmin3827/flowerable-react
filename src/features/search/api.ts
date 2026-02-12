import { axiosInstance } from "@/shared/api/axios";
import { PageResponse, Season } from "@/shared/types";
import { Flower, Shop, Region, District } from "./types";

export const flowerApi = {
  // 꽃 목록 조회
  getFlowers: async (
    category?: Season,
    page: number = 0,
    size: number = 12,
  ): Promise<PageResponse<Flower>> => {
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    params.append("page", page.toString());
    params.append("size", size.toString());
    params.append("sort", "id");

    const res = await axiosInstance.get<PageResponse<Flower>>(
      `/flowers?${params.toString()}`,
    );
    return res.data;
  },

  // 특정 꽃을 보유한 꽃집 검색
  searchShops: async (
    flowerName: string,
    regionDesc?: string,
    districtDesc?: string,
    page: number = 0,
    size: number = 12,
  ): Promise<PageResponse<Shop>> => {
    const params = new URLSearchParams();
    params.append("flowerName", flowerName);
    if (regionDesc) params.append("regionDesc", regionDesc);
    if (districtDesc) params.append("districtDesc", districtDesc);
    params.append("page", page.toString());
    params.append("size", size.toString());
    params.append("sort", "id");

    const res = await axiosInstance.get<PageResponse<Shop>>(
      `/shops/search?${params.toString()}`,
    );
    return res.data;
  },

  // 지역 목록 조회
  getRegions: async (): Promise<Region[]> => {
    const res = await axiosInstance.get<Region[]>("/regions");
    return res.data;
  },

  // 특정 지역의 구/군 목록 조회
  getDistricts: async (region: string): Promise<District[]> => {
    const res = await axiosInstance.get<District[]>(
      `/regions/districts?region=${region}`,
    );
    return res.data;
  },
};
