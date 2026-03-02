import styled from 'styled-components';

export const Container = styled.div`
  max-width: 500px;
  margin: 3rem auto;
  padding: 2rem;
`;

export const TypeSelector = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

export const TypeButton = styled.button<{ $active: boolean }>`
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

export const Form = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
`;

export const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
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
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;

  &:hover:not(:disabled) {
    background-color: #2563eb;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
