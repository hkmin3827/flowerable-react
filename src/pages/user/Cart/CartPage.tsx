import { useNavigate } from "react-router-dom";
import {
  useCart,
  useRemoveCartItem,
  useClearCart,
} from "@/features/cart/hooks";
import { extractErrorMessage } from "@/shared/utils/errorHandler";
import {
  Container,
  CartHeader,
  Title,
  ClearButton,
  CartContent,
  CartItemCard,
  ShopHeader,
  ShopName,
  RemoveShopButton,
  ShopInfo,
  InfoText,
  FlowerList,
  FlowerItem,
  FlowerImage,
  FlowerInfo,
  FlowerName,
  FlowerDetail,
  FlowerPrice,
  ItemFooter,
  ItemTotalBox,
  TotalLabel,
  TotalPrice,
  OrderItemButton,
  Summary,
  SummaryRow,
  SummaryLabel,
  SummaryValue,
  Divider,
  GrandTotal,
  GrandTotalLabel,
  GrandTotalPrice,
  SummaryNote,
  EmptyCart,
  EmptyIcon,
  EmptyText,
  GoShoppingButton,
  LoadingText,
} from "./CartPage.styles";
import { CartItemInfo, FlowerDetailInfo } from "@/features/cart/types";

export const CartPage = () => {
  const navigate = useNavigate();
  const { data: cart, isLoading } = useCart();
  const removeItemMutation = useRemoveCartItem();
  const clearCartMutation = useClearCart();

  const handleRemoveItem = async (cartItemId: number) => {
    if (!confirm("이 항목을 삭제하시겠습니까?")) return;
    try {
      await removeItemMutation.mutateAsync(cartItemId);
    } catch (error) {
      alert(extractErrorMessage(error));
    }
  };

  const handleClearCart = async () => {
    if (!confirm("장바구니를 전체 비우시겠습니까?")) return;
    try {
      await clearCartMutation.mutateAsync();
    } catch (error) {
      alert(extractErrorMessage(error));
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
        {cart.items.map((item: CartItemInfo) => (
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
            </ShopInfo>

            <FlowerList>
              {item.flowers.map((flower: FlowerDetailInfo) => (
                <FlowerItem key={flower.detailId}>
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
