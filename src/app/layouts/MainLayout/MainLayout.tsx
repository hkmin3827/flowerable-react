import { Outlet } from "react-router-dom";
import { Header } from "@/shared/ui/Header";
import { Footer } from "@/shared/ui/Footer";
import { LayoutContainer, MainContent } from "./MainLayout.styles";

export const MainLayout = () => {
  return (
    <LayoutContainer>
      <Header />
      <MainContent>
        <Outlet />
      </MainContent>
      <Footer />
    </LayoutContainer>
  );
};
