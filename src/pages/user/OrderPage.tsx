import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { axiosInstance } from "@/shared/api/axios";
import { useAddToCart } from "@/features/cart/hooks";

interface ShopFlower {
  id: number;
  flower: {
    id: number;
    name: string;
    imageUrl: string;
  };
  price: number;
  colors: string[];
  onSale: boolean;
}

interface WrappingOption {
  colorName: string;
  extraPrice: number;
}

interface Shop {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
}

interface FlowerSelection {
  shopFlowerId: number;
  flowerName: string;
  imageUrl: string;
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
  const [wrappingOptions, setWrappingOptions] = useState<WrappingOption[]>([]);
  const [selections, setSelections] = useState<FlowerSelection[]>([]);
  const [selectedWrapping, setSelectedWrapping] =
    useState<WrappingOption | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (shopId) {
      fetchShopData();
    }
  }, [shopId]);

  const fetchShopData = async () => {
    try {
      const [shopRes, flowersRes, wrappingRes] = await Promise.all([
        axiosInstance.get(`/shops/${shopId}`),
        axiosInstance.get(`/shops/${shopId}/flowers`),
        axiosInstance.get(`/shops/${shopId}/wrapping-options`),
      ]);

      setShop(shopRes.data.data);
      setFlowers(flowersRes.data.data.filter((f: ShopFlower) => f.onSale));
      setWrappingOptions(wrappingRes.data.data || []);
    } catch (error) {
      console.error("Failed to fetch shop data:", error);
      alert("샵 정보를 불러오는데 실패했습니다.");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const addFlower = (flower: ShopFlower, color: string, quantity: number) => {
    const existing = selections.find(
      (s) => s.shopFlowerId === flower.id && s.color === color,
    );

    if (existing) {
      setSelections((prev) =>
        prev.map((s) =>
          s.shopFlowerId === flower.id && s.color === color
            ? { ...s, quantity: s.quantity + quantity }
            : s,
        ),
      );
    } else {
      setSelections((prev) => [
        ...prev,
        {
          shopFlowerId: flower.id,
          flowerName: flower.flower.name,
          imageUrl: flower.flower.imageUrl,
          color,
          quantity,
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

  const calculateTotal = () => {
    const flowerTotal = selections.reduce(
      (sum, s) => sum + s.basePrice * s.quantity,
      0,
    );
    const wrappingTotal = selectedWrapping?.extraPrice || 0;
    return flowerTotal + wrappingTotal;
  };

  const handleAddToCart = async () => {
    if (selections.length === 0) {
      alert("꽃을 선택해주세요.");
      return;
    }

    try {
      await addToCartMutation.mutateAsync({
        shopId: Number(shopId),
        wrappingColorName: selectedWrapping?.colorName,
        wrappingExtraPrice: selectedWrapping?.extraPrice,
        message,
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

  const handleDirectOrder = () => {
    alert("직접 결제 기능은 준비 중입니다. 장바구니를 이용해주세요.");
  };

  if (loading) {
    return (
      <Container>
        <LoadingText>로딩 중...</LoadingText>
      </Container>
    );
  }

  if (!shop) {
    return (
      <Container>
        <ErrorText>샵을 찾을 수 없습니다.</ErrorText>
      </Container>
    );
  }

  return (
    <Container>
      <OrderCard>
        <ShopInfo>
          <ShopName>{shop.name}</ShopName>
          <ShopDetail>{shop.address}</ShopDetail>
          <ShopDetail>{shop.phoneNumber}</ShopDetail>
        </ShopInfo>

        <Section>
          <SectionTitle>1. 꽃 선택</SectionTitle>
          <FlowerGrid>
            {flowers.map((flower) => (
              <FlowerCard key={flower.id}>
                <FlowerImage
                  src={flower.flower.imageUrl}
                  alt={flower.flower.name}
                />
                <FlowerInfo>
                  <FlowerName>{flower.flower.name}</FlowerName>
                  <FlowerPrice>{flower.price.toLocaleString()}원</FlowerPrice>
                  <ColorSelect>
                    {flower.colors.map((color) => (
                      <ColorButton
                        key={color}
                        onClick={() => addFlower(flower, color, 1)}
                      >
                        {color}
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
            <SectionTitle>선택한 꽃</SectionTitle>
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
                        -
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

        {wrappingOptions.length > 0 && (
          <Section>
            <SectionTitle>2. 포장 옵션</SectionTitle>
            <WrappingGrid>
              {wrappingOptions.map((option, idx) => (
                <WrappingOption
                  key={idx}
                  $selected={selectedWrapping?.colorName === option.colorName}
                  onClick={() => setSelectedWrapping(option)}
                >
                  <WrappingName>{option.colorName}</WrappingName>
                  <WrappingPrice>
                    +{option.extraPrice.toLocaleString()}원
                  </WrappingPrice>
                </WrappingOption>
              ))}
            </WrappingGrid>
          </Section>
        )}

        <Section>
          <SectionTitle>3. 요청 사항</SectionTitle>
          <MessageTextarea
            placeholder="요청 사항을 입력해주세요 (선택사항)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </Section>

        <TotalSection>
          <TotalLabel>총 금액</TotalLabel>
          <TotalPrice>{calculateTotal().toLocaleString()}원</TotalPrice>
        </TotalSection>

        <ButtonGroup>
          <AddToCartButton onClick={handleAddToCart}>
            장바구니에 추가
          </AddToCartButton>
          <OrderButton onClick={handleDirectOrder}>바로 결제하기</OrderButton>
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
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 2rem;
`;

const ShopInfo = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #e5e7eb;
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
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1rem;
`;

const FlowerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`;

const FlowerCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const FlowerImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
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
  color: #3b82f6;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const ColorSelect = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const ColorButton = styled.button`
  padding: 0.25rem 0.5rem;
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #3b82f6;
    color: white;
    border-color: #3b82f6;
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
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
`;

const SelectionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const QuantityButton = styled.button`
  width: 1.5rem;
  height: 1.5rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #2563eb;
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
  gap: 0.5rem;
  font-weight: 600;
  color: #111827;
`;

const RemoveButton = styled.button`
  padding: 0.25rem 0.5rem;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  cursor: pointer;

  &:hover {
    background-color: #dc2626;
  }
`;

const WrappingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
`;

const WrappingOption = styled.div<{ $selected: boolean }>`
  padding: 1rem;
  border: 2px solid ${({ $selected }) => ($selected ? "#3b82f6" : "#e5e7eb")};
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  background-color: ${({ $selected }) => ($selected ? "#eff6ff" : "white")};

  &:hover {
    border-color: #3b82f6;
  }
`;

const WrappingName = styled.div`
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.25rem;
`;

const WrappingPrice = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
`;

const MessageTextarea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-family: inherit;
  font-size: 1rem;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const TotalSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
`;

const TotalLabel = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
`;

const TotalPrice = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
`;

const ButtonGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const AddToCartButton = styled.button`
  padding: 1rem;
  background-color: #6b7280;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #4b5563;
  }
`;

const OrderButton = styled.button`
  padding: 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2563eb;
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
