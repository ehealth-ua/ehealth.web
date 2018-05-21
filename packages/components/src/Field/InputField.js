import React from "react";
import styled from "react-emotion/macro";
import { prop, ifProp } from "styled-tools";
import { switchFlags } from "@ehealth/utils";

import Field from "./index";
import LabelText from "./LabelText";

export const TextField = props => <InputField {...props} type="text" />;

export const MultilineTextField = props => (
  <InputField {...props} inputComponent={Textarea} />
);

export const NumberField = props => <InputField {...props} type="number" />;

export const PasswordField = props => <InputField {...props} type="password" />;

export const InputField = ({
  label,
  horizontal = false,
  prefix,
  postfix,
  disabled,
  inputComponent: InputComponent = Input,
  ...props
}) => (
  <Field {...props}>
    {({ input, meta: { active, errored, error, submitError } }) => (
      <FieldWrapper horizontal={horizontal}>
        {label && <LabelText>{label}</LabelText>}
        <InputWrapper>
          <InputBorder disabled={disabled} errored={errored} active={active}>
            {prefix && <InputContent>{prefix}</InputContent>}
            <InputComponent {...input} disabled={disabled} />
            {postfix && <InputContent>{postfix}</InputContent>}
          </InputBorder>
          {errored && <ErrorMessage>{error || submitError}</ErrorMessage>}
        </InputWrapper>
      </FieldWrapper>
    )}
  </Field>
);

export const FieldWrapper = styled.label`
  position: relative;
  width: 100%;
  margin-bottom: ${prop("theme.form.fieldVerticalDistance", 20)}px;
  display: ${ifProp("horizontal", "flex", "block")};
  margin-bottom: ${prop("theme.input.marginBottom", 20)}px;
  align-items: baseline;
  flex-direction: ${ifProp("horizontal", "row", "column")};
  justify-content: ${ifProp("horizontal", "space-between")};
`;

export const InputWrapper = styled.div`
  position: relative;
`;

export const InputBorder = styled.div`
  background-color: #fefefe;
  border: 1px solid
    ${switchFlags(
      {
        disabled: "#dadcde",
        errored: "#ff1f44",
        active: "#11d8fb"
      },
      "#dedede"
    )};
  color: ${ifProp("disabled", "#9e9e9e", "#3d3d3d")};
  display: flex;
  font-size: ${prop("theme.input.fontSize", 14)}px;
  line-height: ${prop("theme.input.lineHeight", 24)}px;
`;

export const InputContent = styled.div`
  padding: ${prop("theme.input.paddingTop", 4)}px
    ${prop("theme.input.paddingHorizontal", 10)}px
    ${prop("theme.input.paddingBottom", 5)}px;
  position: relative;
  text-align: left;
`;

export const Input = styled(InputContent.withComponent("input"))`
  background: none;
  border: none;
  width: 100%;
  overflow: hidden;
  color: inherit;
  flex: 1 1 auto;
  font: inherit;
  line-height: inherit;
  outline: none;

  &::placeholder {
    color: #9e9e9e;
  }
`;

export const InputPlaceholder = styled(InputContent)`
  color: #9e9e9e;
  flex: 1 1 auto;
`;

export const Textarea = Input.withComponent("textarea");

export const ErrorMessage = styled.div`
  background-color: #ff1f44;
  color: #fff;
  font-size: 10px;
  line-height: 1.4;
  padding: 8px 15px 7px 13px;
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 1;
`;
