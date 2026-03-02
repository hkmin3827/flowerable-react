import { LoginForm } from "@/features/auth/components/components";
import { Role } from "@/shared/types";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Container,
  TypeSelector,
  TypeButton,
  SuccessBanner,
} from "./LoginPage.styles";
import { LocationStateWithMessage } from "@/shared/types/error";

export const LoginPage = () => {
  const [role, setRole] = useState<Role>("ROLE_USER");
  const location = useLocation();
  const successMessage = (location.state as LocationStateWithMessage)?.message;

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
