import styled from 'styled-components';

export const Footer = () => {
  return (
    <FooterContainer>
      <FooterInner>
        <Copyright>© 2026 Flowerable. All rights reserved.</Copyright>
        <Links>
          <Link href="/terms">이용약관</Link>
          <Link href="/privacy">개인정보처리방침</Link>
          <Link href="/contact">고객센터</Link>
        </Links>
      </FooterInner>
    </FooterContainer>
  );
};

const FooterContainer = styled.footer`
  border-top: 1px solid #e5e7eb;
  background-color: #f9fafb;
  padding: 2rem 1rem;
`;

const FooterInner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Copyright = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
`;

const Links = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const Link = styled.a`
  font-size: 0.875rem;
  color: #6b7280;
  transition: color 0.2s;

  &:hover {
    color: #374151;
  }
`;
