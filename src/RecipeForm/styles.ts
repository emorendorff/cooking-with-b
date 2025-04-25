import { styled } from "styled-components";

export const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
  background-color: #f4f1e1;
  border-radius: 8px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 14px;
  color: #484848;
`;

export const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #c6b7a8;
  border-radius: 4px;
  font-family: var(--font-secondary);
  font-size: 14px;
`;

export const TextArea = styled.textarea`
  padding: 8px 12px;
  border: 1px solid #c6b7a8;
  border-radius: 4px;
  font-family: var(--font-secondary);
  font-size: 14px;
  min-height: 100px;
`;

export const Button = styled.button`
  background-color: #6a0d2b;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px 24px;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #8a1d3b;
  }
`;

export const DynamicFieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const DynamicField = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const RemoveButton = styled.button`
  background-color: #d18b4f;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
`;

export const AddButton = styled.button`
  background-color: #c6b7a8;
  color: #484848;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
  margin-top: 8px;
  cursor: pointer;
  align-self: flex-start;
`;