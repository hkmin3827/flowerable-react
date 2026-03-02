import styled, { keyframes } from "styled-components";

export const Container = styled.div`
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

export const Card = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  padding: 3rem 2rem;
  text-align: center;
  max-width: 420px;
  width: 100%;
`;

const spin = keyframes`from { transform: rotate(0deg); } to { transform: rotate(360deg); }`;
const fillBar = keyframes`from { width: 0%; } to { width: 100%; }`;

export const Spinner = styled.div`
  width: 3rem;
  height: 3rem;
  border: 4px solid #fce7f3;
  border-top-color: #ec4899;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
  margin: 0 auto 1.5rem;
`;

export const SuccessIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.75rem;
`;

export const Desc = styled.p`
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

export const ProgressBar = styled.div`
  height: 4px;
  background: #fce7f3;
  border-radius: 9999px;
  overflow: hidden;
  &::after {
    content: "";
    display: block;
    height: 100%;
    background: linear-gradient(90deg, #ec4899, #db2777);
    animation: ${fillBar} 1.8s linear forwards;
  }
`;
