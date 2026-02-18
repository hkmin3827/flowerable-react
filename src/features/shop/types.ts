import { ShopStatus, Color } from "@/shared/types";

// API Response Types
export interface ShopDetailResponse {
  id: number;
  email: string;
  shopName: string;
  description: string;
  telnum: string;
  address: string;
  latitude: number;
  longitude: number;
  region: string;
  district: string;
  regionDesc: string;
  districtDesc: string;
  status: ShopStatus;
  deletedAt: string | null;
  registerAt: string;
  shopFlowers: ShopFlowerResponse[];
}

export interface ShopFlowerResponse {
  id: number;
  flowerId: number;
  flowerName: string;
  price: number;
  onSale: boolean;
  colors: Color[];
}

export interface ShopImageResponse {
  id: number;
  imageUrl: string;
  isThumbnail: boolean;
  createdAt: string;
}

export interface WrappingOptionResponse {
  colorNames: string[];
  price: number;
}

// API Request Types
export interface ShopUpdateRequest {
  shopName?: string;
  description?: string;
  telnum?: string;
  regionCode?: string;
  districtCode?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export interface ShopFlowerRegisterRequest {
  flowerId: number;
  colors: Color[];
  price: number;
}

export interface ShopFlowerUpdateRequest {
  price?: number;
  colors?: Color[];
}

export interface WrappingOptionRequest {
  colorNames: string[];
  price: number;
}

export interface FlowerOrderStats {
  rank: number;
  flowerName: string;
  orderCount: number;
}
