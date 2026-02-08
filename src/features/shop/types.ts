import { ShopStatus, Region, BaseEntity } from '@/shared/types';

// API Response Types
export interface ShopDetailResponse extends BaseEntity {
  name: string;
  phone: string;
  businessNumber: string;
  region: Region;
  district: string;
  address: string;
  description?: string;
  status: ShopStatus;
  profileImageUrl?: string;
  rating: number;
  reviewCount: number;
}

export interface ShopSearchResponse {
  id: number;
  name: string;
  region: Region;
  district: string;
  address: string;
  profileImageUrl?: string;
  rating: number;
  distance?: number;
}

// API Request Types
export interface ShopUpdateRequest {
  name?: string;
  phone?: string;
  address?: string;
  description?: string;
}
