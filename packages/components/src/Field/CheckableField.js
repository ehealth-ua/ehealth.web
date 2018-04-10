import React from "react";
import styled from "react-emotion/macro";
import { CheckRightIcon } from "@ehealth/icons";

import Field from "./index";

export const CheckboxField = ({ label, disabled, ...props }) => (
  <Field {...props}>
    {({ input, meta: { active, errored } }) => (
      <FieldWrapper>
        <Input {...input} disabled={disabled} type="checkbox" />
        <CheckBox active={active} errored={errored} disabled={disabled}>
          <CheckMark />
        </CheckBox>
        <LabelText>{label}</LabelText>
      </FieldWrapper>
    )}
  </Field>
);

export const RadioField = ({ label, disabled, ...props }) => (
  <Field {...props}>
    {({ input, meta: { active, errored } }) => (
      <FieldWrapper>
        <Input {...input} disabled={disabled} type="radio" />
        <RadioBox active={active} errored={errored} disabled={disabled}>
          <RadioMark />
        </RadioBox>
        <LabelText>{label}</LabelText>
      </FieldWrapper>
    )}
  </Field>
);

const FieldWrapper = styled.label`
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  position: relative;
  user-select: none;
`;

const Input = styled.input`
  height: 20px;
  width: 20px;
  opacity: 0;
  position: absolute;
  left: 0;
  top: 0;
`;

const CheckBox = styled.div`
  background-color: #fff;
  border-width: 1px;
  border-style: solid;
  border-color: ${props =>
    props.errored ? "#ff1f44" : props.active ? "#11d8fb" : "#c9c9c9"};
  color: ${props => (props.errored ? "#ff1f44" : "#44e240")};
  display: flex;
  height: 20px;
  width: 20px;
  opacity: ${props => props.disabled && "0.5"};
`;

const CheckMark = styled(CheckRightIcon)`
  height: 10px;
  margin: auto;
  opacity: 0;
  transition: opacity 0.05s ease-in-out;

  ${Input}:checked + ${CheckBox} & {
    opacity: 1;
  }
`;

const RadioBox = styled(CheckBox)`
  border-radius: 100%;
`;

const RadioMark = styled(CheckMark.withComponent("div"))`
  background-color: #44e240;
  border-radius: 100%;
  width: 10px;

  ${Input}:checked + ${RadioBox} & {
    opacity: 1;
  }
`;

const LabelText = styled.div`
  margin: 0 10px;
`;
