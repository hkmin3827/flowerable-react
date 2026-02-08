import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuthStore } from "@/features/auth/store";
import { useLogout } from "@/features/auth/hooks";
// import { useCartStore } from "@/features/order/store";

export const Header = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { mutate: logout } = useLogout();
  // const cartItems = useCartStore((state) => state.items);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  return (
    <HeaderContainer>
      <HeaderInner>
        <Logo to="/">Flowerable</Logo>

        <Nav>
          <NavLink to="/flowers">꽃 찾기</NavLink>
          {user?.role === "ROLE_USER" && (
            <>
              <NavLink to="/shops">꽃집 찾기</NavLink>
              <NavLink to="/orders">주문 내역</NavLink>
            </>
          )}
          {user?.role === "ROLE_SHOP" && (
            <>
              <NavLink to="/shop/orders">주문 관리</NavLink>
              <NavLink to="/shop/flowers">꽃 관리</NavLink>
            </>
          )}
        </Nav>

        <Actions>
          {isAuthenticated ? (
            <>
              {/* {user?.role === "ROLE_USER" && (
                <CartButton onClick={() => navigate("/cart")}>
                  🛒 장바구니 ({cartItems.length})
                </CartButton>
              )} */}
              <UserName>{user?.name}님</UserName>
              <Button onClick={handleLogout}>로그아웃</Button>
            </>
          ) : (
            <>
              <Button onClick={() => navigate("/login")}>로그인</Button>
              <Button onClick={() => navigate("/signup")} $primary>
                회원가입
              </Button>
            </>
          )}
        </Actions>
      </HeaderInner>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header`
  border-bottom: 1px solid #e5e7eb;
  background-color: white;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderInner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 1rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
`;

const Nav = styled.nav`
  display: flex;
  gap: 2rem;
`;

const NavLink = styled(Link)`
  font-weight: 500;
  transition: color 0.2s;

  &:hover {
    color: #3b82f6;
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

// const CartButton = styled.button`
//   background: none;
//   border: none;
//   cursor: pointer;
//   font-size: 1rem;
//   transition: opacity 0.2s;

//   &:hover {
//     opacity: 0.7;
//   }
// `;

const UserName = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
`;

const Button = styled.button<{ $primary?: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  ${({ $primary }) =>
    $primary
      ? `
    background-color: #3b82f6;
    color: white;
    &:hover { background-color: #2563eb; }
  `
      : `
    background-color: #f3f4f6;
    color: #374151;
    &:hover { background-color: #e5e7eb; }
  `}
`;
