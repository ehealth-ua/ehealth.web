import React from "react";
import system from "system-components/emotion";
import { RadioIcon } from "@ehealth/icons";

export const RadioField = ({
  selected = false,
  disabled,
  value,
  name,
  children,
  onChange = e => e
}) => (
  <Label disabled={disabled}>
    <input
      type="radio"
      {...{
        onChange: () => !disabled && onChange(value),
        checked: selected,
        value,
        name,
        disabled
      }}
    />
    <RadioIcon selected={selected} disabled={disabled} />
    {children}
  </Label>
);

export default RadioField;

export const Label = system(
  {
    is: "label"
  },
  ({ disabled }) => ({
    color: disabled && "#9299a3",
    cursor: "pointer"
  }),
  `
    user-select: none
  `
);
