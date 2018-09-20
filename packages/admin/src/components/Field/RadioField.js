import React from "react";
import { Label, Circle } from "../RadioView";

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
    <Circle selected={selected} disabled={disabled} />
    {children}
  </Label>
);

export default RadioField;
