import { Outlet } from "react-router-dom";
import { Header } from "@/shared/ui/Header";
import { Footer } from "@/shared/ui/Footer";
import { AIChatbotDrawer } from "@/features/ai-chatbot/components/AIChatbotDrawer";
import { AppShell, MainPane, LayoutContainer, MainContent } from "./MainLayout.styles";

export const MainLayout = () => {
  return (
    <AppShell>
      <MainPane>
        <LayoutContainer>
          <Header />
          <MainContent>
            <Outlet />
          </MainContent>
          <Footer />
        </LayoutContainer>
      </MainPane>
      <AIChatbotDrawer />
    </AppShell>
  );
};
