import React from "react";
import styled from "react-emotion/macro";

import Field from "./index";
import {
  FieldWrapper,
  LabelText,
  InputWrapper,
  InputBorder,
  InputContent,
  InputPlaceholder,
  ErrorMessage
} from "./InputField";

export const FileField = ({
  label,
  placeholder,
  icon,
  multiple,
  disabled,
  ...props
}) => (
  <Field {...props}>
    {({
      input: { value, onChange, onFocus, onBlur },
      meta: { active, errored, error, submitError }
    }) => (
      <FieldWrapper>
        <label>
          {label && <LabelText>{label}</LabelText>}
          <InputWrapper>
            <Input
              type="file"
              multiple={multiple}
              disabled={disabled}
              onChange={event => {
                const { files } = event.target;
                const value = multiple ? Array.from(files) : files[0];
                onChange(value);
              }}
              onFocus={onFocus}
              onBlur={onBlur}
            />
            <InputBorder disabled={disabled} errored={errored} active={active}>
              {(Array.isArray(value) && value.length > 0) || value ? (
                <FileLabel>
                  {multiple ? value.map(f => f.name).join(", ") : value.name}
                </FileLabel>
              ) : (
                <InputPlaceholder>{placeholder}</InputPlaceholder>
              )}
              <Icon>{icon}</Icon>
            </InputBorder>
            {errored && <ErrorMessage>{error || submitError}</ErrorMessage>}
          </InputWrapper>
        </label>
      </FieldWrapper>
    )}
  </Field>
);

export default FileField;

const Input = styled.input`
  opacity: 0;
  height: 0;
  width: 0;
  position: absolute;
`;

const FileLabel = styled(InputContent)`
  flex: 1 1 auto;
`;

const Icon = styled(InputContent)`
  background-color: #f9fafc;
  border-left: 1px solid #dedede;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 0;
  padding-bottom: 0;
`;
