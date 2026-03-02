import styled from "styled-components";

export const FormContainer = styled.form`
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
`;

export const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
`;

export const InputGroup = styled.div`
  margin-bottom: 1.5rem;
`;

export const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #374151;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

export const PasswordWrapper = styled.div`
  position: relative;
`;

export const ShowPasswordButton = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  font-size: 0.875rem;
  cursor: pointer;

  &:hover {
    color: #374151;
  }
`;

export const ErrorText = styled.p`
  font-size: 0.875rem;
  color: #ef4444;
  margin-top: 0.25rem;
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: #2563eb;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const LinkGroup = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
  font-size: 0.875rem;
`;

export const Link = styled.a`
  color: #6b7280;
  text-decoration: none;

  &:hover {
    color: #374151;
  }
`;

export const Divider = styled.span`
  display: flex;
  align-items: center;
  text-align: center;
  margin: 1.5rem 0;
  color: #9ca3af;
  font-size: 0.875rem;

  &::before,
  &::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid #e5e7eb;
  }

  &::before {
    margin-right: 0.75rem;
  }

  &::after {
    margin-left: 0.75rem;
  }
`;

export const SocialLoginSection = styled.div`
  margin-top: 2rem;
`;

export const SocialButton = styled.button<{
  provider: "google" | "kakao" | "naver";
}>`
  width: 100%;
  height: 48px;
  border-radius: 12px;
  border: none;

  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  font-family: "Pretendard", system-ui, sans-serif;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: normal;
  cursor: pointer;

  #google-icon {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }
  #kakao,
  #naver {
    height: 100%;
  }

  ${({ provider }) => {
    switch (provider) {
      case "google":
        return `
          background: #ffffff;
          color: #1f1f1f;
          border: 1px solid #dadce0;
        `;
      case "kakao":
        return `
          background: #FEE500;
          color: #3C1E1E;
        `;
      case "naver":
        return `
          background: #03A94D;
          color: #ffffff;
        `;
    }
  }}
`;
