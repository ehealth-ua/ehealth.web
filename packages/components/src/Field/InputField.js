import React from "react";
import styled from "react-emotion/macro";
import { prop, ifProp, withProp } from "styled-tools";
import { switchFlags } from "@ehealth/utils";

import Field from "./Field";
import FieldView from "./FieldView";

export const TextField = props => <InputField {...props} type="text" />;

export const MultilineTextField = props => (
  <InputField {...props} inputComponent={Textarea} />
);

export const NumberField = props => <InputField {...props} type="number" />;

export const PasswordField = props => <InputField {...props} type="password" />;

export const InputField = ({
  label,
  horizontal,
  size,
  prefix,
  postfix,
  disabled,
  inputComponent: InputComponent = Input,
  ...props
}) => (
  <Field {...props}>
    {({ input, meta: { active, errored, error } }) => (
      <FieldView label={label} horizontal={horizontal}>
        <InputBorder
          disabled={disabled}
          errored={errored}
          active={active}
          size={size}
        >
          {prefix && <InputContent>{prefix}</InputContent>}
          <InputComponent {...input} disabled={disabled} size={size} />
          {postfix && <InputContent>{postfix}</InputContent>}
        </InputBorder>
        {errored && <ErrorMessage>{error}</ErrorMessage>}
      </FieldView>
    )}
  </Field>
);

export const InputBorder = styled.div`
  background-color: #fefefe;
  border: 1px solid
    ${switchFlags(
      {
        disabled: "#efefef",
        errored: "#ff1f44",
        active: "#11d8fb"
      },
      "#dedede"
    )};
  color: ${ifProp("disabled", "#efefef", "#3d3d3d")};
  display: flex;
  font-size: ${withProp(
    [prop("theme.input.fontSize"), "size"],
    (fontSize, size = "medium") => `${fontSize[size]}px`
  )};
  line-height: ${prop("theme.input.lineHeight", 22)}px;
`;

export const InputContent = styled.div`
  padding: ${ifProp(
    "size",
    [
      "theme.input.paddingTop",
      "theme.input.paddingHorizontal",
      "theme.input.paddingBottom"
    ].map(item =>
      withProp([prop(item), "size"], (padding, size) => `${padding[size]}px `)
    ),
    withProp(
      [prop("theme.input.paddingDefault"), "size"],
      ({ top, horizontal, bottom }) => `${top}px ${horizontal}px ${bottom}px`
    )
  )};
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

  &:disabled {
    -webkit-text-fill-color: inherit;
  }

  &::placeholder {
    color: #9e9e9e;
  }
`;

export const InputPlaceholder = styled(InputContent)`
  color: #9e9e9e;
  flex: 1 1 auto;
`;

export const Textarea = styled(Input.withComponent("textarea"))`
  resize: ${ifProp("noResize", "none")};
`;

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
