import React from "react";
import styled from "react-emotion/macro";
import { CheckRightIcon } from "@ehealth/icons";

import Field from "./index";
import LabelText from "./LabelText";

export const CheckboxField = ({ label, disabled, ...props }) => (
  <Field {...props} type="checkbox">
    {({ input, meta: { active, errored }, ...t }) => (
      <FieldWrapper>
        <Input {...input} disabled={disabled} />
        <CheckBox active={active} errored={errored} disabled={disabled}>
          <CheckMark />
        </CheckBox>
        <CheckableLabelText>{label}</CheckableLabelText>
      </FieldWrapper>
    )}
  </Field>
);

export const RadioField = ({ label, disabled, ...props }) => (
  <Field {...props} type="radio">
    {({ input, meta: { active, errored } }) => (
      <FieldWrapper>
        <Input {...input} disabled={disabled} />
        <RadioBox active={active} errored={errored} disabled={disabled}>
          <RadioMark />
        </RadioBox>
        <CheckableLabelText>{label}</CheckableLabelText>
      </FieldWrapper>
    )}
  </Field>
);

const FieldWrapper = styled.label`
  cursor: default;
  display: flex;
  align-items: center;
  position: relative;
  user-select: none;
  margin-bottom: 23px;
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
  flex-shrink: 0;
  align-self: start;
  height: 34px;
  width: 34px;
  opacity: ${props => props.disabled && "0.5"};
`;

const CheckMark = styled(CheckRightIcon)`
  height: 16px;
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
  background-color: #2294f4;
  border-radius: 100%;
  width: 16px;

  ${Input}:checked + ${RadioBox} & {
    opacity: 1;
  }
`;

const CheckableLabelText = styled(LabelText)`
  margin: 0 10px;
`;
