import { Season } from "@/shared/types";

export interface Flower {
  id: number;
  name: string;
  floralLang: string;
  imageUrl: string;
  category: Season;
  active: boolean;
}

export interface Shop {
  id: number;
  shopName: string;
  description: string;
  address: string;
  telnum: string;
  regionDescription: string;
  districtDescription: string;
}

export interface Region {
  code: string;
  description: string;
}

export interface District {
  code: string;
  description: string;
}
