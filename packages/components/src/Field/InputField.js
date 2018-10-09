import React from "react";
import styled from "react-emotion/macro";
import { prop, ifProp, withProp } from "styled-tools";
import MaskedInput from "react-text-mask";
import { switchFlags } from "@ehealth/utils";

import Field from "./Field";
import FieldView from "./FieldView";
import FieldLabelView from "./FieldLabelView";

export const TextField = props => <InputField {...props} type="text" />;

export const MultilineTextField = props => (
  <InputField {...props} inputComponent={Textarea} />
);

export const NumberField = props => <InputField {...props} type="number" />;

export const PasswordField = props => <InputField {...props} type="password" />;

export const MaskField = props => (
  <InputField {...props} inputComponent={MaskContent} />
);

export const InputField = ({
  label,
  horizontal,
  size,
  prefix,
  postfix,
  disabled,
  color,
  placeholder,
  inputComponent: InputComponent = Input,
  fieldComponent: FieldComponent = placeholder && !label
    ? FieldLabelView
    : FieldView,
  ...props
}) => (
  <Field {...props}>
    {({ input, meta: { active, errored, error } }) => (
      <FieldComponent
        label={label || placeholder}
        horizontal={horizontal}
        active={active}
        value={!!input.value}
      >
        <InputBorder
          disabled={disabled}
          errored={errored}
          active={active}
          size={size}
          color={color}
        >
          {prefix && <InputContent>{prefix}</InputContent>}
          <InputComponent
            {...input}
            placeholder={label ? placeholder : null}
            disabled={disabled}
            size={size}
          />
          {postfix && <InputContent>{postfix}</InputContent>}
        </InputBorder>
        {errored && <ErrorMessage>{error}</ErrorMessage>}
      </FieldComponent>
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
  color: ${withProp(
    ["color", "disabled"],
    (color, disabled) => `${color ? color : disabled ? "efefef" : "#3d3d3d"}`
  )};
  display: flex;
  font-size: ${withProp(
    [
      prop("size", "medium"),
      prop("theme.input.fontSize", { small: 14, medium: 16 })
    ],
    (size, fontSize) => `${fontSize[size]}px`
  )};
  line-height: ${prop("theme.input.lineHeight", 22)}px;
`;

export const InputContent = styled.div`
  padding: ${withProp(
    [
      prop("size", "medium"),
      prop("theme.input.paddingTop", { small: 6, medium: 14 }),
      prop("theme.input.paddingHorizontal", { small: 19, medium: 25 }),
      prop("theme.input.paddingBottom", { small: 6, medium: 14 })
    ],
    (size, ...paddings) =>
      paddings.map(padding => `${padding[size]}px`).join(" ")
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

export const MaskContent = props => (
  <InputContent>
    <MaskedInput {...props} />
  </InputContent>
);

export const ErrorMessage = styled.div`
  background-color: #ff1f44;
  color: #fff;
  font-size: 10px;
  line-height: 1.4;
  padding: 8px 15px 7px 13px;
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 3;
`;
