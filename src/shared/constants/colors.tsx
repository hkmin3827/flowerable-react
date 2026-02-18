import { Color } from "@/shared/types";

export interface ColorPalette {
  value: Color;
  label: string;
  hex?: string;
  gradient?: string;
}

export const COLOR_PALETTE: ColorPalette[] = [
  { value: "RED", label: "빨강", hex: "#FF0000" },
  { value: "PINK", label: "분홍", hex: "#FFB6C1" },
  { value: "ORANGE", label: "주황", hex: "#FFA500" },
  { value: "YELLOW", label: "노랑", hex: "#FFFF00" },
  { value: "GREEN", label: "초록", hex: "#00cf00" },
  { value: "BLUE", label: "파랑", hex: "#2a2afd" },
  { value: "PURPLE", label: "보라", hex: "#a300d5" },
  { value: "WHITE", label: "하양", hex: "#ffffff" },
  { value: "BEIGE", label: "베이지", hex: "#f0dcac" },
  { value: "BROWN", label: "갈색", hex: "#785400" },
  { value: "BLACK", label: "검정", hex: "#000" },
  { value: "GRAY", label: "회색", hex: "#adadad" },
  {
    value: "MIXED",
    label: "혼합",
    gradient:
      "linear-gradient(135deg, #FF0000, #FFA500, #FFFF00, #00cf00, #2a2afd, #a300d5)",
  },
];
