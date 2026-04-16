export interface FlowerItem {
  name: string
  floralLang: string
  role: string
}

export interface ShopItem {
  shopId: number
  shopName: string
  address: string
  district: string
  availableFlowers: string[]
}

export interface RecommendResponse {
  phase: string
  recommendation: string | null
  flowers: FlowerItem[] | null
  shops: ShopItem[] | null
  message: string | null
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  shops?: ShopItem[]
}
