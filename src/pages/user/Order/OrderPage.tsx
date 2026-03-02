import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "@/shared/api/axios";
import { useAddToCart } from "@/features/cart/hooks";
import { Color, ShopStatus } from "@/shared/types";
import { extractErrorMessage } from "@/shared/utils/errorHandler";
import {
  Container,
  OrderCard,
  ShopInfoBox,
  ShopName,
  ShopDetail,
  Section,
  SectionTitle,
  FlowerGrid,
  FlowerCard,
  FlowerInfo,
  FlowerName,
  FlowerPrice,
  ColorSelect,
  ColorButton,
  SelectionList,
  SelectionItem,
  SelectionInfo,
  QuantityControl,
  QuantityButton,
  QuantityValue,
  SelectionPrice,
  RemoveButton,
  TotalSection,
  TotalLabel,
  TotalPrice,
  ButtonGroup,
  AddToCartButton,
  OrderButton,
  LoadingText,
  ErrorText,
} from "./OrderPage.styles";

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
    } catch (error) {
      alert(extractErrorMessage(error));
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
