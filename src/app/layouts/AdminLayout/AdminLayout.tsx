import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Users, Store, Package, Flower } from "lucide-react";
import {
  LayoutContainer,
  Sidebar,
  SidebarTitle,
  NavList,
  NavItem,
  MainContent,
} from "./AdminLayout.styles";

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
                $active={isActive}
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
