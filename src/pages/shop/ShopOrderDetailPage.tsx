import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { shopOrderAPI } from "@/features/order/api";
import { OrderDetail } from "@/features/order/types";
import { format } from "date-fns";
import { ArrowLeft, User, Phone } from "lucide-react";
import { OrderStatus } from "@/shared/types";

const ShopOrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetail();
    }
  }, [orderId]);

  const fetchOrderDetail = async () => {
    try {
      const response = await shopOrderAPI.getOrderDetail(Number(orderId));
      setOrder(response.data);
    } catch (error) {
      console.error("Failed to fetch order detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOrder = async () => {
    if (!order || !window.confirm("주문을 접수하시겠습니까?")) return;

    setProcessing(true);
    try {
      await shopOrderAPI.changeStatus(order.orderId, "ACCEPTED");
      alert("주문이 접수되었습니다.");
      fetchOrderDetail();
    } catch (error) {
      console.error("Failed to accept order:", error);
      alert("주문 접수에 실패했습니다.");
    } finally {
      setProcessing(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order || !window.confirm("주문을 취소하시겠습니까?")) return;

    setProcessing(true);
    try {
      await shopOrderAPI.changeStatus(order.orderId, "CANCELED");
      alert("주문이 취소되었습니다.");
      fetchOrderDetail();
    } catch (error) {
      console.error("Failed to cancel order:", error);
      alert("주문 취소에 실패했습니다.");
    } finally {
      setProcessing(false);
    }
  };

  const getStatusText = (status: OrderStatus) => {
    const statusMap = {
      REQUESTED: "신규주문",
      ACCEPTED: "접수완료",
      READY: "준비완료",
      COMPLETED: "완료",
      CANCELED: "취소됨",
    };
    return statusMap[status];
  };

  const getStatusColor = (status: OrderStatus) => {
    const colorMap = {
      REQUESTED: "bg-red-100 text-red-800",
      ACCEPTED: "bg-blue-100 text-blue-800",
      READY: "bg-green-100 text-green-800",
      COMPLETED: "bg-gray-100 text-gray-800",
      CANCELED: "bg-gray-100 text-gray-600",
    };
    return colorMap[status];
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center text-gray-500">주문을 찾을 수 없습니다</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate("/shop/orders")}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-bold">주문 상세</h1>
      </div>

      {/* 주문 정보 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">
              주문번호: {order.orderNumber}
            </p>
            <p className="text-sm text-gray-500">
              {format(new Date(order.createdAt), "yyyy년 MM월 dd일 HH:mm")}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
          >
            {getStatusText(order.status)}
          </span>
        </div>
      </div>

      {/* 고객 정보 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">고객 정보</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-700">
            <User size={20} />
            <span className="font-medium">{order.userName}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Phone size={20} />
            <span>{order.userPhoneNumber}</span>
          </div>
        </div>
      </div>

      {/* 주문 상품 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">주문 상품</h2>
        <div className="space-y-4">
          {(order.items ?? []).map((item, index) => (
            <div key={index} className="flex gap-4 pb-4 border-b last:border-0">
              <div className="flex-1">
                <p className="font-medium">{item.flowerName}</p>
                <p className="text-sm text-gray-600">{item.quantity}개</p>
              </div>
              <p className="font-bold">
                {item.itemTotalPrice.toLocaleString()}원
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 결제 정보 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">결제 정보</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">상품 금액</span>
            <span>{order.totalFlowerPrice.toLocaleString()}원</span>
          </div>
          {order.wrappingColorName && (
            <div className="flex justify-between">
              <span className="text-gray-600">
                포장 ({order.wrappingColorName})
              </span>
              <span>{order.wrappingExtraPrice.toLocaleString()}원</span>
            </div>
          )}
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between text-lg font-bold">
              <span>총 금액</span>
              <span className="text-pink-600">
                {order.totalPrice.toLocaleString()}원
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 요청사항 */}
      {order.message && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">요청사항</h2>
          <p className="text-gray-700">{order.message}</p>
        </div>
      )}

      {/* 주문 처리 버튼 */}
      <div className="space-y-3">
        {order.status === "REQUESTED" && (
          <>
            <button
              onClick={handleAcceptOrder}
              disabled={processing}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {processing ? "처리 중..." : "주문 접수"}
            </button>
            <button
              onClick={handleCancelOrder}
              disabled={processing}
              className="w-full py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50"
            >
              주문 취소
            </button>
          </>
        )}

        {(order.status === "READY" || order.status === "ACCEPTED") && (
          <button
            onClick={handleCancelOrder}
            disabled={processing}
            className="w-full py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50"
          >
            {processing ? "처리 중..." : "주문 취소"}
          </button>
        )}

        {(order.status === "COMPLETED" || order.status === "CANCELED") && (
          <button
            disabled
            className="w-full py-3 bg-gray-300 text-gray-500 rounded-lg font-medium cursor-not-allowed"
          >
            처리 완료
          </button>
        )}
      </div>
    </div>
  );
};

export default ShopOrderDetailPage;
