import styled from 'styled-components';
import { colors } from '@/shared/ui/CommonStyles';

export const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${colors.background};
`;

export const Sidebar = styled.aside`
  width: 16rem;
  background: ${colors.white};
  border-right: 1px solid ${colors.border};
  padding: 2rem 0;
`;

export const SidebarTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${colors.primary};
  padding: 0 1.5rem;
  margin-bottom: 2rem;
`;

export const NavList = styled.nav`
  display: flex;
  flex-direction: column;
`;

export const NavItem = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.5rem;
  border: none;
  background: ${({ $active }) =>
    $active ? colors.primaryLight : "transparent"};
  color: ${({ $active }) => ($active ? colors.primary : colors.text)};
  font-size: 1rem;
  font-weight: ${({ $active }) => ($active ? "600" : "500")};
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  width: 100%;

  &:hover {
    background: ${colors.primaryLight};
    color: ${colors.primary};
  }

  svg {
    flex-shrink: 0;
  }
`;

export const MainContent = styled.main`
  flex: 1;
  overflow-y: auto;
`;
