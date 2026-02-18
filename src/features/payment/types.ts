export interface PaymentConfirmReq {
  paymentKey: string;
  orderId: string; // orderNumber
  amount: number;
}

export interface PaymentConfirmRes {
  orderId: number; // DB orderId
}

export type PaymentMethod = "CARD" | "TRANSFER" | "VIRTUAL_ACCOUNT" | "MOBILE_PHONE";

export interface PaymentMethodOption {
  value: PaymentMethod;
  label: string;
  description: string;
}

export const PAYMENT_METHODS: PaymentMethodOption[] = [
  { value: "CARD", label: "카드", description: "신용카드 / 체크카드" },
  { value: "TRANSFER", label: "계좌이체", description: "실시간 계좌이체" },
  { value: "VIRTUAL_ACCOUNT", label: "가상계좌", description: "무통장 입금" },
];
