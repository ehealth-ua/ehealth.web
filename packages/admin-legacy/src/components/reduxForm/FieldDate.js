import React from "react";
import Input from "../Input";

import FieldInput from "./FieldInput";

const FieldDate = props => (
  <FieldInput
    component={Input}
    pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
    {...props}
  />
);

export default FieldDate;
