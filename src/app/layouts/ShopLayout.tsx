import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { ShopSidebar } from '@/shared/ui/ShopSidebar';
import { Header } from '@/shared/ui/Header';

export const ShopLayout = () => {
  return (
    <LayoutContainer>
      <Header />
      <ContentWrapper>
        <ShopSidebar />
        <MainContent>
          <Outlet />
        </MainContent>
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
  display: flex;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
`;
