import styled from 'styled-components';

export const InputGroup = styled.div`
  margin-bottom: 20px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  font-size: 14px;
  color: #333;
`;

export const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  background-color: white;

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
    color: #999;
  }

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

export const ErrorText = styled.span`
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: #ff4444;
`;
