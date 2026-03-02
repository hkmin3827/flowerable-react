import styled, { keyframes } from "styled-components";

export const Container = styled.div`
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
`;

export const ContentBox = styled.div`
  text-align: center;
`;

export const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
`;

export const Description = styled.p`
  margin-top: 0.5rem;
  color: #4b5563;
`;
export const SubDescription = styled.p`
  margin-top: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
`;
export const ErrorIconWrapper = styled.div`
  margin-bottom: 1rem;
  color: #ef4444;
  svg {
    margin-left: auto;
    margin-right: auto;
    height: 3rem;
    width: 3rem;
  }
`;
export const SpinnerWrapper = styled.div`
  margin-bottom: 1rem;
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const Spinner = styled.div`
  margin-left: auto;
  margin-right: auto;
  height: 3rem;
  width: 3rem;
  animation: ${spin} 1s linear infinite;
  border-radius: 9999px;
  border-width: 4px;
  border-style: solid;
  border-color: #e5e7eb;
  border-top-color: #2563eb;
`;
