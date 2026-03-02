import styled from 'styled-components';

export const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
  padding: 1rem;
`;

export const Card = styled.div`
  width: 100%;
  max-width: 440px;
  background: white;
  border-radius: 1rem;
  padding: 2.5rem 2rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  text-align: center;
`;

export const IconWrapper = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

export const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.75rem;
`;

export const Description = styled.p`
  font-size: 0.9rem;
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

export const Form = styled.form`
  text-align: left;
`;

export const InputGroup = styled.div`
  margin-bottom: 1.25rem;
`;

export const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.4rem;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.7rem 0.9rem;
  border: 1.5px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s;

  &:focus {
    border-color: #3b82f6;
  }
`;

export const ErrorText = styled.p`
  font-size: 0.8rem;
  color: #ef4444;
  margin-top: 0.3rem;
`;

export const ErrorBanner = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 0.8rem;
  background-color: #3b82f6;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
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

export const BackButton = styled.button`
  width: 100%;
  padding: 0.8rem;
  background-color: #f3f4f6;
  color: #374151;
  font-size: 0.95rem;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e5e7eb;
  }
`;

export const BackLink = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  font-size: 0.875rem;
  cursor: pointer;
  margin-top: 1.5rem;
  display: block;
  margin-left: auto;
  margin-right: auto;

  &:hover {
    color: #3b82f6;
    text-decoration: underline;
  }
`;
