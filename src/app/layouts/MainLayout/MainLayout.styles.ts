import styled from 'styled-components';

export const AppShell = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
`;

export const MainPane = styled.div`
  flex: 1;
  min-width: 0;
  height: 100vh;
  overflow-y: auto;
`;

export const LayoutContainer = styled.div`
  min-height: 100%;
  display: flex;
  flex-direction: column;
`;

export const MainContent = styled.main`
  flex: 1;
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 1rem;
`;
