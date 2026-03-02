import { Outlet } from "react-router-dom";
import { Header } from "@/shared/ui/Header";
import { LayoutContainer, ContentWrapper } from "./ShopLayout.styles";

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
