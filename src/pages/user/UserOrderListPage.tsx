import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userOrderAPI } from "@/features/order/api";
import { OrderList } from "@/features/order/types";
import { format } from "date-fns";
import { Package, ChevronRight } from "lucide-react";
import { OrderStatus } from "@/shared/types";

const UserOrderListPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderList[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await userOrderAPI.getOrders(page, 10);
      setOrders(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status: OrderStatus) => {
    const statusMap = {
      REQUESTED: "주문요청",
      ACCEPTED: "접수완료",
      READY: "준비완료",
      COMPLETED: "완료",
      CANCELED: "취소됨",
    };
    return statusMap[status];
  };

  const getStatusColor = (status: OrderStatus) => {
    const colorMap = {
      REQUESTED: "bg-yellow-100 text-yellow-800",
      ACCEPTED: "bg-blue-100 text-blue-800",
      READY: "bg-green-100 text-green-800",
      COMPLETED: "bg-gray-100 text-gray-800",
      CANCELED: "bg-red-100 text-red-800",
    };
    return colorMap[status];
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center text-gray-500">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">주문 내역</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <Package size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">주문 내역이 없습니다</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.orderId}
              onClick={() => navigate(`/orders/${order.orderId}`)}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    주문번호: {order.orderNumber}
                  </p>
                  {/* <h3 className="text-lg font-bold">{order.shopName}</h3> */}
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
                >
                  {getStatusText(order.status)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold text-pink-600">
                    {order.totalPrice.toLocaleString()}원
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {format(new Date(order.createdAt), "yyyy.MM.dd HH:mm")}
                  </p>
                </div>
                <ChevronRight size={24} className="text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            onClick={() => setPage((prev) => Math.max(0, prev - 1))}
            disabled={page === 0}
            className="px-4 py-2 rounded-lg bg-gray-200 disabled:opacity-50"
          >
            이전
          </button>
          <span className="px-4 py-2">
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={() =>
              setPage((prev) => Math.min(totalPages - 1, prev + 1))
            }
            disabled={page === totalPages - 1}
            className="px-4 py-2 rounded-lg bg-gray-200 disabled:opacity-50"
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
};

export default UserOrderListPage;
