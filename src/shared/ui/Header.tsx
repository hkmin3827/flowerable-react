import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useState } from "react";
import { useAuthStore } from "@/features/auth/store";
import { useLogout } from "@/features/auth/hooks";
import { useCartCount } from "@/features/cart/hooks";
import logo from "../../images/logos/flowerable로고배경제거.png";
import { NotificationDropdown } from "@/features/notification/components/NotificationDropdown";
import {
  useUnreadNotificationCount,
  useNotificationSSE,
} from "@/features/notification/hooks";
import { useAIChatbotStore } from "@/features/ai-chatbot/store";

export const Header = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { mutate: logout } = useLogout();
  const navigate = useNavigate();
  const isUser = isAuthenticated && user?.role === "ROLE_USER";
  const { data: cartCount } = useCartCount(isUser);
  const [menuOpen, setMenuOpen] = useState(false);
  const [shopMenuOpen, setShopMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const { data: unreadCount } = useUnreadNotificationCount(isAuthenticated);
  const { toggle: toggleChatbot } = useAIChatbotStore();

  useNotificationSSE();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setShopMenuOpen(false);
  };
  const handleShopProtectedClick = (path: string) => {
    if (user?.role === "ROLE_SHOP" && user?.shopStatus === "PENDING") {
      alert("관리자 승인 대기중입니다.");
      return;
    }

    navigate(path);
    closeMenu();
  };

  const handleDashBoardLogoClick = (path: string) => {
    if (location.pathname === path) {
      window.location.reload();
    } else {
      navigate(path);
    }
  };

  return (
    <>
      <HeaderContainer>
        <HeaderInner>
          {(!isAuthenticated || user?.role === "ROLE_USER") && (
            <Logo to="/">
              <img src={logo} alt="플라워러블 로고" width="40" />
              Flowerable
            </Logo>
          )}

          {user?.role === "ROLE_SHOP" && user.shopStatus != "PENDING" && (
            <DashboardLogo
              onClick={() => handleDashBoardLogoClick("/shop/dashboard")}
            >
              <img src={logo} alt="플라워러블 로고" width="40" />
              Flowerable
            </DashboardLogo>
          )}
          {user?.role === "ROLE_SHOP" && user.shopStatus === "PENDING" && (
            <Logo to="/shop/pending-home">
              <img src={logo} alt="플라워러블 로고" width="40" />
              Flowerable
            </Logo>
          )}

          <DesktopNav>
            {user?.role === "ROLE_USER" && (
              <>
                <NavLink to="/flowers">꽃다발 주문</NavLink>
                <NavLink to="/orders">주문 내역</NavLink>
                <NavLink to="/chats">1:1 문의</NavLink>
              </>
            )}
            {user?.role === "ROLE_SHOP" && (
              <>
                <NavLink to="/shop/flowers-view">꽃 조회</NavLink>
                <NavLink
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleShopProtectedClick("/shop/manage");
                  }}
                >
                  샵 관리
                </NavLink>

                <NavLink
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleShopProtectedClick("/shop/orders");
                  }}
                >
                  주문 내역
                </NavLink>
                <NavLink
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleShopProtectedClick("/chats");
                  }}
                >
                  1:1 문의
                </NavLink>
              </>
            )}
          </DesktopNav>

          <DesktopActions>
            <NotificationWrapper>
              <IconButton
                onClick={() => setNotificationOpen(!notificationOpen)}
                title="알림"
              >
                🔔
                {(unreadCount ?? 0) > 0 && (
                  <NotificationBadge>
                    {unreadCount! > 99 ? "99+" : unreadCount}
                  </NotificationBadge>
                )}
              </IconButton>
              {notificationOpen && (
                <NotificationDropdown
                  onClose={() => setNotificationOpen(false)}
                />
              )}
            </NotificationWrapper>
            {isAuthenticated && user?.role === "ROLE_USER" && (
              <>
                <CartButton onClick={() => navigate("/cart")}>
                  🛒
                  {cartCount && cartCount.count > 0 && (
                    <CartBadge>{cartCount.count}</CartBadge>
                  )}
                </CartButton>
              </>
            )}

            {isAuthenticated ? (
              <>
                <UserName
                  onClick={() => {
                    if (user?.role === "ROLE_USER") {
                      navigate("/profile");
                    } else if (user?.role === "ROLE_SHOP") {
                      navigate("/shop/profile");
                    }
                  }}
                >
                  <span>{user?.name}</span>님
                </UserName>
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
          </DesktopActions>

          <Hamburger onClick={() => setMenuOpen(!menuOpen)}>☰</Hamburger>
        </HeaderInner>
      </HeaderContainer>

      <Overlay $open={menuOpen} onClick={closeMenu} />

      <MobileMenu $open={menuOpen}>
        <MobileContent>
          {isAuthenticated && <MobileUserName>{user?.name}님</MobileUserName>}

          {user?.role === "ROLE_USER" && (
            <>
              <MobileLink to="/" onClick={closeMenu}>
                홈
              </MobileLink>
              <MobileLink to="/flowers" onClick={closeMenu}>
                꽃 찾기
              </MobileLink>
              <MobileLink to="/shops" onClick={closeMenu}>
                꽃집 찾기
              </MobileLink>
              <MobileLink to="/orders" onClick={closeMenu}>
                주문 내역
              </MobileLink>{" "}
              <MobileLink to="/chats" onClick={closeMenu}>
                실시간 문의
              </MobileLink>
              <MobileLink to="/cart" onClick={closeMenu}>
                장바구니
                {cartCount && cartCount.count > 0 && (
                  <CartBadge>{cartCount.count}</CartBadge>
                )}
              </MobileLink>
            </>
          )}

          {user?.role === "ROLE_SHOP" && (
            <>
              <MobileLink to="/" onClick={closeMenu}>
                홈
              </MobileLink>
              <MobileLink to="/shop/flowers-view" onClick={closeMenu}>
                꽃 조회
              </MobileLink>
              <DropdownButton onClick={() => setShopMenuOpen(!shopMenuOpen)}>
                샵 관리
                <Arrow $open={shopMenuOpen}>▾</Arrow>
              </DropdownButton>

              <DropdownContainer $open={shopMenuOpen}>
                <MobileSubLink
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleShopProtectedClick("/shop/manage");
                  }}
                >
                  My 샵
                </MobileSubLink>
                <MobileSubLink
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleShopProtectedClick("/shop/flowers/manage");
                  }}
                >
                  보유 꽃 관리
                </MobileSubLink>
                <MobileSubLink
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleShopProtectedClick("/shop/wrapping");
                  }}
                >
                  포장지 옵션 관리
                </MobileSubLink>
              </DropdownContainer>

              <MobileLink
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleShopProtectedClick("/shop/orders");
                }}
              >
                주문 내역
              </MobileLink>
              <MobileLink
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleShopProtectedClick("/shop/chat");
                }}
              >
                1:1 문의
              </MobileLink>
            </>
          )}

          {!isAuthenticated && (
            <>
              <MobileButton onClick={() => navigate("/login")}>
                로그인
              </MobileButton>
              <MobileButton $primary onClick={() => navigate("/signup")}>
                회원가입
              </MobileButton>
            </>
          )}

          {user?.role === "ROLE_USER" && (
            <MobileAIChatbotBtn
              onClick={() => {
                toggleChatbot();
                closeMenu();
              }}
            >
              <img src={logo} alt="로고" /> 꽃 추천 챗봇
            </MobileAIChatbotBtn>
          )}

          {isAuthenticated && (
            <BottomLogout>
              <MobileButton onClick={handleLogout}>로그아웃</MobileButton>
            </BottomLogout>
          )}
        </MobileContent>
      </MobileMenu>
    </>
  );
};

/* ================== Styled ================== */

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
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  display: flex;
  gap: 5px;
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
  align-items: center;
`;

const DashboardLogo = styled.div`
  display: flex;
  gap: 5px;
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
  align-items: center;
  cursor: pointer;
`;

const DesktopNav = styled.nav`
  display: flex;
  gap: 2rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  font-weight: 500;
  transition: color 0.2s;

  &:hover {
    color: #3b82f6;
  }
`;

const DesktopActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const UserName = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
  cursor: default;
  span {
    border-bottom: 1px solid #999;
    cursor: pointer;
  }
`;

const Hamburger = styled.button`
  display: none;
  font-size: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

/* ===== Mobile Menu ===== */

const Overlay = styled.div<{ $open: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  visibility: ${({ $open }) => ($open ? "visible" : "hidden")};
  transition: 0.3s;
  z-index: 150;
`;

const MobileMenu = styled.div<{ $open: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  width: 260px;
  height: 100vh;
  background: white;
  transform: ${({ $open }) => ($open ? "translateX(0)" : "translateX(100%)")};
  transition: transform 0.3s ease-in-out;
  z-index: 200;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);

  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem 1.5rem;
  height: 100%;
`;

const MobileUserName = styled.div`
  font-weight: 600;
  margin-bottom: 1.5rem;
`;

const MobileLink = styled(Link)`
  padding: 0.75rem 0;
  font-weight: 500;
  position: relative;
  display: flex;
  align-items: center;
`;

const BottomLogout = styled.div`
  margin-top: auto;
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

const MobileButton = styled(Button)`
  width: 100%;
  margin-top: 0.5rem;
`;
const DropdownButton = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;

  font-size: 1rem; /* 추가 */
  color: inherit; /* 추가 */
  font-family: inherit;
`;

const Arrow = styled.span<{ $open: boolean }>`
  transition: transform 0.3s;
  transform: ${({ $open }) => ($open ? "rotate(180deg)" : "rotate(0)")};
`;

const DropdownContainer = styled.div<{ $open: boolean }>`
  overflow: hidden;
  max-height: ${({ $open }) => ($open ? "500px" : "0")};
  transition: max-height 0.3s ease;
  display: flex;
  flex-direction: column;
`;

const MobileSubLink = styled(NavLink)`
  padding: 0.6rem 1rem;
  margin-left: 0.5rem;
  font-size: 0.9rem;
  border-radius: 0.5rem;
  color: #4b5563;

  &.active {
    background-color: #3b82f6;
    color: white;
  }
`;

const IconButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

const NotificationWrapper = styled.div`
  position: relative;
`;

const CartButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

const CartBadge = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  background-color: #ef4444;
  color: white;
  border-radius: 50%;
  width: 1.2rem;
  height: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 600;
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  background-color: #ef4444;
  color: white;
  border-radius: 50%;
  width: 1.2rem;
  height: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 600;
`;

const MobileAIChatbotBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 0;
  font-size: 1rem;
  font-weight: 500;
  font-family: inherit;
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
  text-align: left;

  img {
    width: 20px;
  }
`;
