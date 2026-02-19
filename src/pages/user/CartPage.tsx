import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  useCart,
  useRemoveCartItem,
  useClearCart,
} from "@/features/cart/hooks";

export const CartPage = () => {
  const navigate = useNavigate();
  const { data: cart, isLoading } = useCart();
  const removeItemMutation = useRemoveCartItem();
  const clearCartMutation = useClearCart();

  const handleRemoveItem = async (cartItemId: number) => {
    if (!confirm("이 항목을 삭제하시겠습니까?")) return;
    try {
      await removeItemMutation.mutateAsync(cartItemId);
    } catch (error: any) {
      alert(error.response?.data?.message || "삭제에 실패했습니다.");
    }
  };

  const handleClearCart = async () => {
    if (!confirm("장바구니를 전체 비우시겠습니까?")) return;
    try {
      await clearCartMutation.mutateAsync();
    } catch (error: any) {
      alert(error.response?.data?.message || "실패했습니다.");
    }
  };

  const handleOrderCartItem = (cartItemId: number) => {
    navigate(`/checkout/cart/${cartItemId}`);
  };

  if (isLoading) {
    return (
      <Container>
        <LoadingText>로딩 중...</LoadingText>
      </Container>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <Container>
        <EmptyCart>
          <EmptyIcon>🛒</EmptyIcon>
          <EmptyText>장바구니가 비어있습니다</EmptyText>
          <GoShoppingButton onClick={() => navigate("/flowers")}>
            꽃 둘러보기
          </GoShoppingButton>
        </EmptyCart>
      </Container>
    );
  }

  return (
    <Container>
      <CartHeader>
        <Title>장바구니</Title>
        <ClearButton onClick={handleClearCart}>전체 비우기</ClearButton>
      </CartHeader>

      <CartContent>
        {cart.items.map((item: any) => (
          <CartItemCard key={item.cartItemId}>
            <ShopHeader>
              <ShopName>{item.shopName}</ShopName>
              <RemoveShopButton
                onClick={() => handleRemoveItem(item.cartItemId)}
              >
                삭제
              </RemoveShopButton>
            </ShopHeader>

            <ShopInfo>
              <InfoText>{item.shopAddress}</InfoText>
              <InfoText>{item.shopPhoneNumber}</InfoText>
            </ShopInfo>

            <FlowerList>
              {item.flowers.map((flower: any) => (
                <FlowerItem key={flower.detailId}>
                  {flower.imageUrl && (
                    <FlowerImage
                      src={flower.imageUrl}
                      alt={flower.flowerName}
                    />
                  )}
                  <FlowerInfo>
                    <FlowerName>{flower.flowerName}</FlowerName>
                    <FlowerDetail>색상: {flower.flowerColor}</FlowerDetail>
                    <FlowerDetail>수량: {flower.quantity}개</FlowerDetail>
                  </FlowerInfo>
                  <FlowerPrice>
                    {flower.totalPrice.toLocaleString()}원
                  </FlowerPrice>
                </FlowerItem>
              ))}
            </FlowerList>

            <ItemFooter>
              <ItemTotalBox>
                <TotalLabel>소계</TotalLabel>
                <TotalPrice>
                  {item.totalFlowerPrice.toLocaleString()}원
                </TotalPrice>
              </ItemTotalBox>
              <OrderItemButton
                onClick={() => handleOrderCartItem(item.cartItemId)}
              >
                주문하기 →
              </OrderItemButton>
            </ItemFooter>
          </CartItemCard>
        ))}
      </CartContent>

      <Summary>
        <SummaryRow>
          <SummaryLabel>총 {cart.totalShopCount}개 샵</SummaryLabel>
          <SummaryValue></SummaryValue>
        </SummaryRow>
        <Divider />
        <GrandTotal>
          <GrandTotalLabel>전체 꽃 금액</GrandTotalLabel>
          <GrandTotalPrice>
            {cart.totalPrice.toLocaleString()}원
          </GrandTotalPrice>
        </GrandTotal>
        <SummaryNote>각 항목의 "주문하기" 버튼을 눌러 결제하세요.</SummaryNote>
      </Summary>
    </Container>
  );
};

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;
const CartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;
const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
`;
const ClearButton = styled.button`
  padding: 0.5rem 1rem;
  background: #bcbcbc;
  color: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  &:hover {
    background: #dc2626;
    color: white;
  }
`;
const CartContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;
const CartItemCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
`;
const ShopHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f7ca23;
`;
const ShopName = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
`;
const RemoveShopButton = styled.button`
  padding: 0.25rem 0.75rem;
  background: #bcbcbc;
  color: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  &:hover {
    background: #dc2626;
    color: white;
  }
`;
const ShopInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 1rem;
`;
const InfoText = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
`;
const FlowerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;
const FlowerItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: #fff18340;
  border-radius: 0.5rem;
`;
const FlowerImage = styled.img`
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 0.375rem;
  flex-shrink: 0;
`;
const FlowerInfo = styled.div`
  flex: 1;
`;
const FlowerName = styled.div`
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.125rem;
`;
const FlowerDetail = styled.div`
  font-size: 0.8rem;
  color: #6b7280;
`;
const FlowerPrice = styled.div`
  font-weight: 600;
  color: #000;
`;
const ItemFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
`;
const ItemTotalBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;
const TotalLabel = styled.div`
  font-weight: 500;
  color: #374151;
`;
const TotalPrice = styled.div`
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
`;
const OrderItemButton = styled.button`
  padding: 0.625rem 1.25rem;
  background: linear-gradient(135deg, #3b63f2, #294ccc);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.925rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.9;
  }
`;
const Summary = styled.div`
  background: white;
  border: 2px solid #3b63f2;
  border-radius: 0.75rem;
  padding: 1.5rem;
`;
const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;
const SummaryLabel = styled.div`
  color: #6b7280;
`;
const SummaryValue = styled.div`
  font-weight: 600;
  color: #111827;
`;
const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 1rem 0;
`;
const GrandTotal = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`;
const GrandTotalLabel = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
`;
const GrandTotalPrice = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b63f2;
`;
const SummaryNote = styled.div`
  font-size: 0.825rem;
  color: #9ca3af;
  text-align: center;
`;
const EmptyCart = styled.div`
  text-align: center;
  padding: 4rem 1rem;
`;
const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;
const EmptyText = styled.div`
  font-size: 1.25rem;
  color: #6b7280;
  margin-bottom: 2rem;
`;
const GoShoppingButton = styled.button`
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, #3b63f2, #294ccc);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
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
