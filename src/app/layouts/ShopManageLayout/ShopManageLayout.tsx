import { Outlet } from "react-router-dom";
import { ShopSidebar } from "@/shared/ui/ShopSidebar";
import { Wrapper, Content } from "./ShopManageLayout.styles";

export const ShopManageLayout = () => {
  return (
    <Wrapper>
      <ShopSidebar />
      <Content>
        <Outlet />
      </Content>
    </Wrapper>
  );
};
