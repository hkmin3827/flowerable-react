import { NavLink } from "react-router-dom";
import styled from "styled-components";

export const ShopSidebar = () => {
  return (
    <SidebarContainer>
      <Title>샵 관리</Title>

      <Nav>
        <StyledNavLink to="/shop/manage" end>
          My 샵
        </StyledNavLink>
        <StyledNavLink to="/shop/flowers/manage">보유 꽃 관리</StyledNavLink>
        <StyledNavLink to="/shop/wrapping">포장지 옵션 관리</StyledNavLink>
      </Nav>
    </SidebarContainer>
  );
};

const SidebarContainer = styled.aside`
  width: 240px;
  background-color: #f9fafb;
  border-right: 1px solid #e5e7eb;
  padding: 2rem 1rem;
  @media (max-width: 768px) {
    display: none;
  }
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
