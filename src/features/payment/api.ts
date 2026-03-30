import { axiosInstance } from "@/shared/api/axios";
import type { PaymentConfirmReq, PaymentConfirmRes } from "./types";

export const paymentAPI = {
  confirm: (req: PaymentConfirmReq) =>
    axiosInstance.post<PaymentConfirmRes>("/payments/confirm", req, {
      timeout: 15000,
    }),
};
