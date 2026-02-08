import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

export const ShopSidebar = () => {
  return (
    <SidebarContainer>
      <Title>샵 관리</Title>
      <Nav>
        <StyledNavLink to="/shop/dashboard">대시보드</StyledNavLink>
        <StyledNavLink to="/shop/orders">주문 내역</StyledNavLink>
        <StyledNavLink to="/shop/flowers">보유 꽃 관리</StyledNavLink>
        <StyledNavLink to="/shop/profile">샵 정보</StyledNavLink>
      </Nav>
    </SidebarContainer>
  );
};

const SidebarContainer = styled.aside`
  width: 240px;
  background-color: #f9fafb;
  border-right: 1px solid #e5e7eb;
  padding: 2rem 1rem;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  padding: 0 1rem;
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const StyledNavLink = styled(NavLink)`
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s;
  color: #374151;

  &:hover {
    background-color: #f3f4f6;
  }

  &.active {
    background-color: #3b82f6;
    color: white;
  }
`;
