import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { Header } from '@/shared/ui/Header';
import { Footer } from '@/shared/ui/Footer';

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

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 1rem;
`;
