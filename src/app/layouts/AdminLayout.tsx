import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { colors } from "@/shared/ui/CommonStyles";
import { Users, Store, Package, Flower } from "lucide-react";

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${colors.background};
`;

const Sidebar = styled.aside`
  width: 16rem;
  background: ${colors.white};
  border-right: 1px solid ${colors.border};
  padding: 2rem 0;
`;

const SidebarTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${colors.primary};
  padding: 0 1.5rem;
  margin-bottom: 2rem;
`;

const NavList = styled.nav`
  display: flex;
  flex-direction: column;
`;

const NavItem = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.5rem;
  border: none;
  background: ${({ active }) => (active ? colors.primaryLight : "transparent")};
  color: ${({ active }) => (active ? colors.primary : colors.text)};
  font-size: 1rem;
  font-weight: ${({ active }) => (active ? "600" : "500")};
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  width: 100%;

  &:hover {
    background: ${colors.primaryLight};
    color: ${colors.primary};
  }

  svg {
    flex-shrink: 0;
  }
`;

const MainContent = styled.main`
  flex: 1;
  overflow-y: auto;
`;

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: "/admin/accounts", label: "계정 관리", icon: Users },
    { path: "/admin/shops", label: "샵 관리", icon: Store },
    { path: "/admin/orders", label: "주문 모니터링", icon: Package },
    { path: "/admin/flowers", label: "꽃 관리", icon: Flower },
  ];

  return (
    <LayoutContainer>
      <Sidebar>
        <SidebarTitle>관리자</SidebarTitle>
        <NavList>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavItem
                key={item.path}
                active={isActive}
                onClick={() => navigate(item.path)}
              >
                <Icon size={20} />
                {item.label}
              </NavItem>
            );
          })}
        </NavList>
      </Sidebar>
      <MainContent>
        <Outlet />
      </MainContent>
    </LayoutContainer>
  );
};

export default AdminLayout;
