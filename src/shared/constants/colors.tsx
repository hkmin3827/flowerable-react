import { Color } from "@/shared/types";

export interface ColorPalette {
  value: Color;
  label: string;
  hex: string;
}

export const COLOR_PALETTE: ColorPalette[] = [
  { value: "RED", label: "빨강", hex: "#FF0000" },
  { value: "PINK", label: "분홍", hex: "#FFB6C1" },
  { value: "ORANGE", label: "주황", hex: "#FFA500" },
  { value: "YELLOW", label: "노랑", hex: "#FFFF00" },
  { value: "GREEN", label: "초록", hex: "#00FF00" },
  { value: "BLUE", label: "파랑", hex: "#0000FF" },
  { value: "PURPLE", label: "보라", hex: "#800080" },
  { value: "WHITE", label: "흰색", hex: "#ffffff" },
  { value: "MIXED", label: "혼합", hex: "#FFD700" },
];
