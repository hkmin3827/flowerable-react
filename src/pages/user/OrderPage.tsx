import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { axiosInstance } from "@/shared/api/axios";
import { useAddToCart } from "@/features/cart/hooks";
import { Color, ShopStatus } from "@/shared/types";

interface ShopFlower {
  id: number;
  flowerId: number;
  flowerName: string;
  price: number;
  colors: Color[];
  onSale: boolean;
}

interface Shop {
  id: number;
  shopName: string;
  address: string;
  regionDesc: string;
  districtDesc: string;
  telnum: string;
  status: ShopStatus;
  registerAt: number;
  shopFlowers: ShopFlower[];
}

export interface FlowerSelection {
  shopFlowerId: number;
  flowerName: string;
  color: string;
  quantity: number;
  basePrice: number;
}

export const OrderPage = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const navigate = useNavigate();
  const addToCartMutation = useAddToCart();

  const [shop, setShop] = useState<Shop | null>(null);
  const [flowers, setFlowers] = useState<ShopFlower[]>([]);
  const [selections, setSelections] = useState<FlowerSelection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (shopId) fetchShopData();
  }, [shopId]);

  const fetchShopData = async () => {
    try {
      const shopRes = await axiosInstance.get(`/shops/${shopId}`);
      const shopData: Shop = shopRes.data;
      setShop(shopData);
      setFlowers(shopData.shopFlowers.filter((f) => f.onSale));
    } catch {
      alert("샵 정보를 불러오는데 실패했습니다.");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const addFlower = (flower: ShopFlower, color: string) => {
    const existing = selections.find(
      (s) => s.shopFlowerId === flower.id && s.color === color,
    );
    if (existing) {
      setSelections((prev) =>
        prev.map((s) =>
          s.shopFlowerId === flower.id && s.color === color
            ? { ...s, quantity: s.quantity + 1 }
            : s,
        ),
      );
    } else {
      setSelections((prev) => [
        ...prev,
        {
          shopFlowerId: flower.id,
          flowerName: flower.flowerName,
          color,
          quantity: 1,
          basePrice: flower.price,
        },
      ]);
    }
  };

  const removeFlower = (shopFlowerId: number, color: string) => {
    setSelections((prev) =>
      prev.filter(
        (s) => !(s.shopFlowerId === shopFlowerId && s.color === color),
      ),
    );
  };

  const updateQuantity = (
    shopFlowerId: number,
    color: string,
    quantity: number,
  ) => {
    if (quantity < 1) {
      removeFlower(shopFlowerId, color);
      return;
    }
    setSelections((prev) =>
      prev.map((s) =>
        s.shopFlowerId === shopFlowerId && s.color === color
          ? { ...s, quantity }
          : s,
      ),
    );
  };

  const flowerTotal = selections.reduce(
    (sum, s) => sum + s.basePrice * s.quantity,
    0,
  );

  const handleAddToCart = async () => {
    if (selections.length === 0) {
      alert("꽃을 선택해주세요.");
      return;
    }
    try {
      await addToCartMutation.mutateAsync({
        shopId: Number(shopId),
        flowers: selections.map((s) => ({
          shopFlowerId: s.shopFlowerId,
          quantity: s.quantity,
          flowerColor: s.color as any,
        })),
      });
      alert("장바구니에 추가되었습니다.");
      navigate("/cart");
    } catch (error: any) {
      alert(error.response?.data?.message || "장바구니 추가에 실패했습니다.");
    }
  };

  const handleOrder = () => {
    if (selections.length === 0) {
      alert("꽃을 선택해주세요.");
      return;
    }
    navigate(`/checkout/shop/${shopId}`, {
      state: { flowers: selections, shopName: shop?.shopName },
    });
  };

  if (loading)
    return (
      <Container>
        <LoadingText>로딩 중...</LoadingText>
      </Container>
    );
  if (!shop)
    return (
      <Container>
        <ErrorText>샵을 찾을 수 없습니다.</ErrorText>
      </Container>
    );

  return (
    <Container>
      <OrderCard>
        <ShopInfoBox>
          <ShopName>{shop.shopName}</ShopName>
          <ShopDetail>
            {shop.regionDesc} {shop.districtDesc} {shop.address}
          </ShopDetail>
          <ShopDetail>{shop.telnum}</ShopDetail>
        </ShopInfoBox>

        <Section>
          <SectionTitle>🌸 꽃 선택</SectionTitle>
          <FlowerGrid>
            {flowers.map((flower) => (
              <FlowerCard key={flower.id}>
                <FlowerInfo>
                  <FlowerName>{flower.flowerName}</FlowerName>
                  <FlowerPrice>
                    {flower.price.toLocaleString()}원 / 송이
                  </FlowerPrice>
                  <ColorSelect>
                    {flower.colors.map((color) => (
                      <ColorButton
                        key={color}
                        onClick={() => addFlower(flower, color)}
                      >
                        + {color}
                      </ColorButton>
                    ))}
                  </ColorSelect>
                </FlowerInfo>
              </FlowerCard>
            ))}
          </FlowerGrid>
        </Section>

        {selections.length > 0 && (
          <Section>
            <SectionTitle>✅ 선택한 꽃</SectionTitle>
            <SelectionList>
              {selections.map((sel, idx) => (
                <SelectionItem key={`${sel.shopFlowerId}-${sel.color}-${idx}`}>
                  <SelectionInfo>
                    <span>
                      {sel.flowerName} ({sel.color})
                    </span>
                    <QuantityControl>
                      <QuantityButton
                        onClick={() =>
                          updateQuantity(
                            sel.shopFlowerId,
                            sel.color,
                            sel.quantity - 1,
                          )
                        }
                      >
                        −
                      </QuantityButton>
                      <QuantityValue>{sel.quantity}</QuantityValue>
                      <QuantityButton
                        onClick={() =>
                          updateQuantity(
                            sel.shopFlowerId,
                            sel.color,
                            sel.quantity + 1,
                          )
                        }
                      >
                        +
                      </QuantityButton>
                    </QuantityControl>
                  </SelectionInfo>
                  <SelectionPrice>
                    {(sel.basePrice * sel.quantity).toLocaleString()}원
                    <RemoveButton
                      onClick={() => removeFlower(sel.shopFlowerId, sel.color)}
                    >
                      삭제
                    </RemoveButton>
                  </SelectionPrice>
                </SelectionItem>
              ))}
            </SelectionList>
          </Section>
        )}

        <TotalSection>
          <TotalLabel>꽃 합계</TotalLabel>
          <TotalPrice>{flowerTotal.toLocaleString()}원</TotalPrice>
        </TotalSection>

        <ButtonGroup>
          <AddToCartButton onClick={handleAddToCart}>
            🛒 장바구니 담기
          </AddToCartButton>
          <OrderButton onClick={handleOrder}>주문하기 →</OrderButton>
        </ButtonGroup>
      </OrderCard>
    </Container>
  );
};

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;
const OrderCard = styled.div`
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 2rem;
`;
const ShopInfoBox = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #fce7f3;
`;
const ShopName = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
`;
const ShopDetail = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
`;
const Section = styled.div`
  margin-bottom: 2rem;
`;
const SectionTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #f3f4f6;
`;
const FlowerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`;
const FlowerCard = styled.div`
  border: 1px solid #fce7f3;
  border-radius: 0.5rem;
  overflow: hidden;
  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: 0 4px 12px rgba(236, 72, 153, 0.15);
  }
`;
const FlowerInfo = styled.div`
  padding: 1rem;
`;
const FlowerName = styled.div`
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.25rem;
`;
const FlowerPrice = styled.div`
  color: #ec4899;
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
`;
const ColorSelect = styled.div`
  display: flex;
  gap: 0.375rem;
  flex-wrap: wrap;
`;
const ColorButton = styled.button`
  padding: 0.25rem 0.625rem;
  background: #fdf2f8;
  border: 1px solid #f9a8d4;
  border-radius: 9999px;
  font-size: 0.75rem;
  cursor: pointer;
  color: #be185d;
  transition: all 0.2s;
  &:hover {
    background: #ec4899;
    color: white;
    border-color: #ec4899;
  }
`;
const SelectionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;
const SelectionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.875rem 1rem;
  background: #fdf2f8;
  border-radius: 0.5rem;
  border: 1px solid #fce7f3;
`;
const SelectionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.9rem;
  color: #374151;
`;
const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
const QuantityButton = styled.button`
  width: 1.75rem;
  height: 1.75rem;
  background: #ec4899;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 1rem;
  &:hover {
    background: #db2777;
  }
`;
const QuantityValue = styled.span`
  min-width: 2rem;
  text-align: center;
  font-weight: 600;
`;
const SelectionPrice = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 600;
  color: #111827;
`;
const RemoveButton = styled.button`
  padding: 0.25rem 0.625rem;
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fca5a5;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  cursor: pointer;
  &:hover {
    background: #dc2626;
    color: white;
  }
`;
const TotalSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
`;
const TotalLabel = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
`;
const TotalPrice = styled.div`
  font-size: 1.375rem;
  font-weight: 700;
  color: #ec4899;
`;
const ButtonGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;
const AddToCartButton = styled.button`
  padding: 1rem;
  background: white;
  color: #ec4899;
  border: 2px solid #ec4899;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: #fdf2f8;
  }
`;
const OrderButton = styled.button`
  padding: 1rem;
  background: linear-gradient(135deg, #ec4899, #db2777);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.9;
  }
`;
const LoadingText = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: 1.125rem;
  color: #6b7280;
`;
const ErrorText = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: 1.125rem;
  color: #ef4444;
`;
