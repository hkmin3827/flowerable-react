import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { Header } from "@/shared/ui/Header";

export const ShopLayout = () => {
  return (
    <LayoutContainer>
      <Header />
      <ContentWrapper>
        <Outlet />
      </ContentWrapper>
    </LayoutContainer>
  );
};

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const ContentWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
`;
