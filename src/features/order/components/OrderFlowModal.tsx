import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { ShopDetail, WrappingOption, OrderCreateReq } from "../types";
import { userOrderAPI } from "../api";
import { ShopDetailResponse } from "@/features/shop/types";

interface OrderFlowModalProps {
  shop: ShopDetailResponse;
  onClose: () => void;
}

type Step = "flower" | "wrapping" | "confirm";

interface SelectedFlower {
  shopFlowerId: number;
  flowerName: string;
  flowerPrice: number;
  quantity: number;
}

const OrderFlowModal: React.FC<OrderFlowModalProps> = ({ shop, onClose }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("flower");
  const [selectedFlowers, setSelectedFlowers] = useState<SelectedFlower[]>([]);
  const [wrappingOption, setWrappingOption] = useState<WrappingOption | null>(
    null,
  );
  const [selectedWrapping, setSelectedWrapping] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWrappingOptions();
  }, []);

  const fetchWrappingOptions = async () => {
    try {
      const response = await userOrderAPI.getWrappingOptions(shop.id);
      setWrappingOption(response.data);
    } catch (error) {
      console.error("Failed to fetch wrapping options:", error);
    }
  };

  const handleFlowerQuantityChange = (
    shopFlowerId: number,
    quantity: number,
  ) => {
    const flower = shop.shopFlowers.find((f) => f.id === shopFlowerId);
    if (!flower) return;

    if (quantity === 0) {
      setSelectedFlowers((prev) =>
        prev.filter((f) => f.shopFlowerId !== shopFlowerId),
      );
    } else {
      setSelectedFlowers((prev) => {
        const existing = prev.find((f) => f.shopFlowerId === shopFlowerId);
        if (existing) {
          return prev.map((f) =>
            f.shopFlowerId === shopFlowerId ? { ...f, quantity } : f,
          );
        } else {
          return [
            ...prev,
            {
              shopFlowerId: flower.id,
              flowerName: flower.flowerName,
              flowerPrice: flower.price,
              quantity,
            },
          ];
        }
      });
    }
  };

  const getFlowerQuantity = (shopFlowerId: number) => {
    return (
      selectedFlowers.find((f) => f.shopFlowerId === shopFlowerId)?.quantity ||
      0
    );
  };

  const getTotalFlowerPrice = () => {
    return selectedFlowers.reduce(
      (sum, f) => sum + f.flowerPrice * f.quantity,
      0,
    );
  };

  const getTotalPrice = () => {
    const flowerPrice = getTotalFlowerPrice();
    const wrappingPrice =
      selectedWrapping && wrappingOption ? wrappingOption.price : 0;
    return flowerPrice + wrappingPrice;
  };

  const handleNext = () => {
    if (step === "flower") {
      if (selectedFlowers.length === 0) {
        alert("꽃을 선택해주세요.");
        return;
      }
      setStep("wrapping");
    } else if (step === "wrapping") {
      setStep("confirm");
    }
  };

  const handleBack = () => {
    if (step === "wrapping") {
      setStep("flower");
    } else if (step === "confirm") {
      setStep("wrapping");
    }
  };

  const handleSubmitOrder = async () => {
    setLoading(true);
    try {
      const orderReq: OrderCreateReq = {
        orderItems: selectedFlowers.map((f) => ({
          shopFlowerId: f.shopFlowerId,
          quantity: f.quantity,
        })),
        wrappingColorName: selectedWrapping,
        message: message || null,
      };

      const response = await userOrderAPI.createOrder(shop.id, orderReq);
      alert("주문이 완료되었습니다!");
      navigate(`/orders/${response.data}`);
      onClose();
    } catch (error) {
      console.error("Failed to create order:", error);
      alert("주문에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 배경 오버레이 */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* 모달 */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl bg-white rounded-lg shadow-2xl z-50 flex flex-col max-h-[90vh]">
        {/* 헤더 */}
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-4">
            {step !== "flower" && (
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ChevronLeft size={24} />
              </button>
            )}
            <h2 className="text-xl font-bold">
              {step === "flower" && "꽃 선택"}
              {step === "wrapping" && "포장 선택"}
              {step === "confirm" && "주문 확인"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        {/* 내용 */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === "flower" && (
            <div className="space-y-4">
              {shop.shopFlowers
                .filter((f) => f.onSale)
                .map((flower) => (
                  <div
                    key={flower.id}
                    className="flex gap-4 p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{flower.flowerName}</h3>
                      <p className="text-pink-600 font-bold">
                        {flower.price.toLocaleString()}원
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handleFlowerQuantityChange(
                            flower.id,
                            Math.max(0, getFlowerQuantity(flower.id) - 1),
                          )
                        }
                        className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-medium">
                        {getFlowerQuantity(flower.id)}
                      </span>
                      <button
                        onClick={() =>
                          handleFlowerQuantityChange(
                            flower.id,
                            Math.min(getFlowerQuantity(flower.id) + 1),
                          )
                        }
                        className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {step === "wrapping" && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg mb-4">
                포장 색상 선택 (선택사항)
              </h3>
              {wrappingOption && wrappingOption.colorNames.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    {wrappingOption.colorNames.map((color) => (
                      <button
                        key={color}
                        onClick={() =>
                          setSelectedWrapping(
                            selectedWrapping === color ? null : color,
                          )
                        }
                        className={`p-4 border-2 rounded-lg text-center font-medium ${
                          selectedWrapping === color
                            ? "border-pink-600 bg-pink-50"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                  {selectedWrapping && (
                    <p className="text-gray-600">
                      포장 추가 비용: {wrappingOption.price.toLocaleString()}원
                    </p>
                  )}
                </>
              ) : (
                <p className="text-gray-500">제공되는 포장 옵션이 없습니다.</p>
              )}

              <div className="mt-6">
                <label className="block font-medium mb-2">
                  요청사항 (선택사항)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="요청사항을 입력해주세요"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  rows={4}
                />
              </div>
            </div>
          )}

          {step === "confirm" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-lg mb-4">선택한 꽃</h3>
                <div className="space-y-3">
                  {selectedFlowers.map((flower) => (
                    <div
                      key={flower.shopFlowerId}
                      className="flex justify-between"
                    >
                      <span>
                        {flower.flowerName} × {flower.quantity}
                      </span>
                      <span className="font-medium">
                        {(
                          flower.flowerPrice * flower.quantity
                        ).toLocaleString()}
                        원
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedWrapping && wrappingOption && (
                <div>
                  <h3 className="font-bold text-lg mb-4">포장</h3>
                  <div className="flex justify-between">
                    <span>{selectedWrapping}</span>
                    <span className="font-medium">
                      {wrappingOption.price.toLocaleString()}원
                    </span>
                  </div>
                </div>
              )}

              {message && (
                <div>
                  <h3 className="font-bold text-lg mb-2">요청사항</h3>
                  <p className="text-gray-700">{message}</p>
                </div>
              )}

              <div className="border-t pt-4">
                <div className="flex justify-between text-xl font-bold">
                  <span>총 결제 금액</span>
                  <span className="text-pink-600">
                    {getTotalPrice().toLocaleString()}원
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className="p-4 border-t">
          <div className="flex justify-between items-center mb-3">
            <span className="font-bold">합계</span>
            <span className="text-2xl font-bold text-pink-600">
              {getTotalPrice().toLocaleString()}원
            </span>
          </div>

          {step === "confirm" ? (
            <button
              onClick={handleSubmitOrder}
              disabled={loading}
              className="w-full py-3 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 disabled:opacity-50"
            >
              {loading ? "주문 중..." : "결제하기"}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="w-full py-3 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 flex items-center justify-center gap-2"
            >
              다음
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default OrderFlowModal;
