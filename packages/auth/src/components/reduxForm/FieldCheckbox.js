import React from "react";

import Checkbox from "../Checkbox";

import FieldInput from "./FieldInput";

const FieldCheckbox = props => (
  <FieldInput
    Component={Checkbox}
    {...props}
    type="checkbox"
    checked={props.input.value}
  />
);

export default FieldCheckbox;
