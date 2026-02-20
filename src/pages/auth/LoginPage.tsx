import { LoginForm } from "@/features/auth/components";
import { Role } from "@/shared/types";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

export const LoginPage = () => {
  const [role, setRole] = useState<Role>("ROLE_USER");
  const location = useLocation();
  const successMessage = (location.state as any)?.message;

  return (
    <Container>
      {successMessage && <SuccessBanner>{successMessage}</SuccessBanner>}
      <TypeSelector>
        <TypeButton
          $active={role === "ROLE_USER"}
          onClick={() => setRole("ROLE_USER")}
        >
          일반 회원
        </TypeButton>
        <TypeButton
          $active={role === "ROLE_SHOP"}
          onClick={() => setRole("ROLE_SHOP")}
        >
          샵 회원
        </TypeButton>
        <TypeButton
          $active={role === "ROLE_ADMIN"}
          onClick={() => setRole("ROLE_ADMIN")}
        >
          관리자
        </TypeButton>
      </TypeSelector>

      <LoginForm role={role} />
    </Container>
  );
};

const Container = styled.div`
  max-width: 500px;
  margin: 3rem auto;
  padding: 2rem;
`;

const TypeSelector = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const TypeButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 0.75rem;
  border: 2px solid ${({ $active }) => ($active ? "#3b82f6" : "#d1d5db")};
  background-color: ${({ $active }) => ($active ? "#eff6ff" : "white")};
  color: ${({ $active }) => ($active ? "#3b82f6" : "#6b7280")};
  font-weight: 600;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #3b82f6;
  }
`;

const SuccessBanner = styled.div`
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #15803d;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
  text-align: center;
`;
