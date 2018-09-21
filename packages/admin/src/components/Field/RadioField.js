import React from "react";
import { RadioIcon } from "@ehealth/icons";

import { Label } from "../RadioView";

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
