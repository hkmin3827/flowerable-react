import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { ShopSidebar } from "@/shared/ui/ShopSidebar";

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
const Wrapper = styled.div`
  display: flex;
  min-height: calc(100vh - 64px);
`;

const Content = styled.div`
  flex: 1;
  padding: 2rem;
`;
