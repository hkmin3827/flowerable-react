import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { shopApi } from "@/features/shop/api";
import { MapPin, Phone, MessageCircle, ShoppingCart } from "lucide-react";
import { ShopDetailResponse } from "@/features/shop/types";
import { chatAPI } from "@/features/chat/api";
import { useAuthStore } from "@/features/auth/store";

const ShopDetailPage: React.FC = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [shop, setShop] = useState<ShopDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (shopId) {
      fetchShopDetail();
    }
  }, [shopId]);

  const fetchShopDetail = async () => {
    try {
      const response = await shopApi.getShopDetail(Number(shopId));
      setShop(response);
    } catch (error) {
      console.error("Failed to fetch shop detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = () => {
    if (!isAuthenticated) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    if (user?.role !== "ROLE_USER") {
      alert("사용자만 주문할 수 있습니다.");
      return;
    }

    navigate(`/order/${shopId}`);
  };

  const handleInquiry = async () => {
    if (!shopId) return;

    if (!isAuthenticated) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    try {
      // 채팅방 생성 또는 가져오기
      const response = await chatAPI.getOrCreateChatRoom(Number(shopId));
      const chatRoomId = response.data;
      navigate("/chats");
    } catch (error) {
      console.error("Failed to create chat room:", error);
      alert("문의하기에 실패했습니다.");
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center text-gray-500">가게를 찾을 수 없습니다</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 가게 이미지 */}
      {/* {shop.image.length > 0 && (
        <div className="mb-8">
          <img
            src={shop.imageUrls[0]}
            alt={shop.name}
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>
      )} */}

      {/* 가게 정보 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold mb-4">{shop.shopName}</h1>

        {shop.description && (
          <p className="text-gray-700 mb-4">{shop.description}</p>
        )}

        <div className="space-y-3">
          <div className="flex items-start gap-2 text-gray-600">
            <MapPin size={20} className="flex-shrink-0 mt-1" />
            <span>{shop.address}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Phone size={20} />
            <span>{shop.telnum}</span>
          </div>
        </div>

        {/* 주문/문의 버튼 */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleOrder}
            className="flex-1 py-3 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 flex items-center justify-center gap-2"
          >
            <ShoppingCart size={20} />
            주문하기
          </button>
          <button
            onClick={handleInquiry}
            className="flex-1 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 flex items-center justify-center gap-2"
          >
            <MessageCircle size={20} />
            문의하기
          </button>
        </div>
      </div>

      {/* 판매 중인 꽃 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">판매 중인 꽃</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shop.shopFlowers
            .filter((flower) => flower.onSale)
            .map((flower) => (
              <div
                key={flower.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="font-bold text-lg mb-2">{flower.flowerName}</h3>
                <p className="text-pink-600 font-bold text-xl mb-2">
                  {flower.price.toLocaleString()}원
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ShopDetailPage;
