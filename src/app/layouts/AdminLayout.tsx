import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

export const AdminLayout = () => {
  return (
    <LayoutContainer>
      <Sidebar>
        <h2>관리자</h2>
        {/* 관리자 메뉴 */}
      </Sidebar>
      <MainContent>
        <Outlet />
      </MainContent>
    </LayoutContainer>
  );
};

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Sidebar = styled.aside`
  width: 240px;
  background-color: #1f2937;
  color: white;
  padding: 2rem 1rem;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  background-color: #f9fafb;
`;
